import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  searchBar: FormGroup = new FormGroup({
    request: new FormControl(''),
  });

  get request() {
    return this.searchBar.get('request');
  }

  ngOnInit(): void {}
}
