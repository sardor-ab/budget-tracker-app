import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
})
export class ActionComponent implements OnInit {
  @Input() label!: string;
  @Input() canUse!: boolean;
  @Input() action!: () => void;
  constructor() {}

  ngOnInit(): void {}
}
