import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { FormsModule } from '@angular/forms';
import { GameInfoComponent } from '../game-info/game-info.component';
import { Firestore, collection, doc, collectionData, onSnapshot, addDoc, updateDoc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Console, log } from 'console';
import { ActivatedRoute } from '@angular/router';
import { PlayerMobileComponent } from '../player-mobile/player-mobile.component';
import { EditPlayerComponent } from '../edit-player/edit-player.component';





@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatButtonModule, MatIconModule, FormsModule, GameInfoComponent, PlayerMobileComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {

  game: Game = new Game();
  firestore: Firestore = inject(Firestore);
  items$: any;
  items: any;
  gameOver = false;
  unsubList: any;
  unSubSingle: any;
  currentId: any;



  constructor(private route: ActivatedRoute, public dialog: MatDialog) {

    // this.unsubList = onSnapshot(this.getGameRef(), (list) => {
    //   list.forEach(element => {
    //     console.log(element.data());
    //   })
    // });

    // this.unSubSingle = onSnapshot(this.getSingleDocRef("games", "ffeffe"), (element) => {

    // })

    // this.unSubSingle();
    // this.items$ = collectionData(this.getGameRef());
    // this.items = this.items$.subscribe((list:any) => {
    //   list.forEach(element => {
    //     console.log(element)
    //   });
    // })
    // this.items.unsubsribe();
  }
  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe(params => {
      const gameId = params['id'];
      this.currentId = gameId
      console.log(this.currentId);

      // Verwenden Sie die ID, um Firestore-Abfragen durchzuführen
      this.unSubSingle = onSnapshot(this.getSingleDocRef("games", gameId), (currentGame) => {
        console.log('update', currentGame.data());
        const gameData = currentGame.data()!;
        this.game.currentPlayer = gameData['currentplayer'];
        this.game.player_images = gameData['player_images']
        this.game.playedCards = gameData['playedCards'];
        this.game.players = gameData['players'];
        this.game.stack = gameData['stack'];
        this.game.pickCardAnimation = gameData['pickCardAnimation'];
        this.game.currentCard = gameData['currentCard'];
      });
    })

  }

  ngonDestroy() {
    if (this.unSubSingle) {
      this.unSubSingle();
    }
  }

  editPlayer(playerId: number) {
    console.log('edit player', playerId);

    const dialogRef = this.dialog.open(EditPlayerComponent);

    dialogRef.afterClosed().subscribe(change => {
      if (change) {
        if (change == 'delete') {
          this.game.players.splice(playerId, 1)
          this.game.player_images.splice(playerId, 1)
        } else {
          console.log('recived change', change)
          this.game.player_images[playerId] = change;

        }
        this.saveGame();
      }

    });


  }

  getGameRef() {
    return collection(this.firestore, 'games')
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId)
  }

  async saveGame() {
    try {
      const gameRef = this.getSingleDocRef("games", this.currentId);

      // Rufen Sie die aktuellen Spielinformationen aus der Datenbank ab
      const docSnapshot = await getDoc(gameRef);

      if (docSnapshot.exists()) {
        const currentGame = docSnapshot.data();

        // Führen Sie die erforderlichen Aktualisierungen durch
        currentGame['currentplayer'] = this.game.currentPlayer;
        currentGame['player_images'] = this.game.player_images
        currentGame['playedCards'] = this.game.playedCards;
        currentGame['players'] = this.game.players;
        currentGame['stack'] = this.game.stack;
        currentGame['pickCardAnimation'] = this.game.pickCardAnimation;
        currentGame['currentCard'] = this.game.currentCard;

        // Aktualisieren Sie die Daten in der Datenbank
        await updateDoc(gameRef, currentGame);
        console.log(this.currentId, 'Game saved');
      }
    } catch (error) {
      console.error('Error saving game:', error);
    }
  }

  async newGame() {

    this.game = new Game();
  }

  takeCard() {
    if (this.game.stack.length == 0) {
      this.gameOver = true;
    }
    else if (!this.game.pickCardAnimation && this.game.players.length > 0) {
      this.game.currentCard = this.game.stack.pop() ?? '';
      console.log(this.game.currentCard)
      this.game.pickCardAnimation = true;
      this.saveGame()

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false
        this.saveGame()
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, {
    });

    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.game.player_images.push('affe.png')
        this.saveGame()
      }
    });

  }
}

