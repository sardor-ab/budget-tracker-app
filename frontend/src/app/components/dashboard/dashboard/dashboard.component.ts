import { Component, OnInit } from '@angular/core';
import { ListService } from '../../list/services/list.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private listService: ListService) {}

  ngOnInit(): void {
    this.listService.updateType('transactions');
  }
}
