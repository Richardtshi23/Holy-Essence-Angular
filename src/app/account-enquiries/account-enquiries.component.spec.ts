import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountEnquiriesComponent } from './account-enquiries.component';

describe('AccountEnquiriesComponent', () => {
  let component: AccountEnquiriesComponent;
  let fixture: ComponentFixture<AccountEnquiriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountEnquiriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountEnquiriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
