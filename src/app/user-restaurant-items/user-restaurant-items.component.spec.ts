import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRestaurantItemsComponent } from './user-restaurant-items.component';

describe('UserRestaurantItemsComponent', () => {
  let component: UserRestaurantItemsComponent;
  let fixture: ComponentFixture<UserRestaurantItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRestaurantItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRestaurantItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
