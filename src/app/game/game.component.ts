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
import { Firestore, collection, doc, collectionData, onSnapshot, addDoc, updateDoc,getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Console, log } from 'console';
import { ActivatedRoute } from '@angular/router';




@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatButtonModule, MatIconModule, FormsModule, GameInfoComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  game: Game = new Game();
  currentCard: string = '';
  firestore: Firestore = inject(Firestore);
  items$: any;
  items: any;
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
        this.game.playedCards = gameData['playedCards'];
        this.game.players = gameData['players'];
        this.game.stack = gameData['stack'];
      });
    })

  }

  ngonDestroy() {
    if (this.unSubSingle) {
      this.unSubSingle();
    }
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
        currentGame['playedCards'] = this.game.playedCards;
        currentGame['players'] = this.game.players;
        currentGame['stack'] = this.game.stack;
  
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
    if (!this.pickCardAnimation && this.game.players.length > 0) {


      this.currentCard = this.game.stack.pop() ?? '';
      console.log(this.currentCard)
      this.pickCardAnimation = true;
      this.saveGame()

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length
      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false
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
        this.saveGame()
      }
    });
    
  }
}

