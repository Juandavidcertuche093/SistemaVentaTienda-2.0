import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersPagesComponent } from './users-pages.component';

describe('UsersPagesComponent', () => {
  let component: UsersPagesComponent;
  let fixture: ComponentFixture<UsersPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
