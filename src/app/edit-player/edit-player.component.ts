import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-edit-player',
  standalone: true,
  imports: [CommonModule,MatDialogModule],
  templateUrl: './edit-player.component.html',
  styleUrl: './edit-player.component.scss'
})
export class EditPlayerComponent implements OnInit {
  constructor(public dialog: MatDialog) {

  }
  allProfilePictures = ['affe.png', 'crocodile.png', 'giraffe.png', 'lion.png', 'pinguin.png', 'snake.png',]

  ngOnInit(): void {
  }

}
