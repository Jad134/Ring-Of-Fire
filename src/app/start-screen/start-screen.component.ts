import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, doc, collectionData, onSnapshot, addDoc } from '@angular/fire/firestore';
import { Game } from '../../models/game';
import { GameComponent } from '../game/game.component';



@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {

  constructor(private firestore: Firestore, private router: Router) {

  }

 async newGame() {
    console.log('startGame')
    let game = new Game()
    //-----------------------------Aktivieren für das hochladen von neuen spielen------------------------
    await addDoc(this.getGameRef(), game.toJson()).catch(
      (err) => { console.error(err) }
    ).then(
      (gameInfo:any) => { ; 
      this.router.navigateByUrl('/game/' + gameInfo.id)}
     
    )
    //console.log(game);
    
  }
  getGameRef() {
    return collection(this.firestore, 'games') // Beobachten. Vllt nicht richtig funktionstüchtig da es aus game.component stand
  }
}

//0Vp0Dxsi7jD6gh7f5L2a


