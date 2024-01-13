import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule,MatDialogModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent implements OnInit {

  @Input() name:string;
  @Input() image;
  @Input() playerActive: boolean = false;
  constructor(){
    this.name = '';
    this.image ='';
  } ;

  ngOnInit(): void { 
    
  }
}
