import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-edit-player',
  standalone: true,
  imports: [CommonModule, MatDialogModule,MatButtonModule],
  templateUrl: './edit-player.component.html',
  styleUrl: './edit-player.component.scss'
})
export class EditPlayerComponent implements OnInit {
  @Input() delete: string;
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<EditPlayerComponent>,) {
    this.delete = 'delete';
  }
  allProfilePictures = ['affe.png', 'crocodile.png', 'giraffe.png', 'lion.png', 'pinguin.png', 'snake.png',]

  ngOnInit(): void {
  }

}
