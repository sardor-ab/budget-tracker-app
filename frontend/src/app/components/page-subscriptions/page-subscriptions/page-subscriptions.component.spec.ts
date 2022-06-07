import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSubscriptionsComponent } from './page-subscriptions.component';

describe('PageSubscriptionsComponent', () => {
  let component: PageSubscriptionsComponent;
  let fixture: ComponentFixture<PageSubscriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageSubscriptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
