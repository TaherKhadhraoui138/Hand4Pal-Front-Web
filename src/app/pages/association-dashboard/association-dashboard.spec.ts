import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationDashboard } from './association-dashboard';

describe('AssociationDashboard', () => {
  let component: AssociationDashboard;
  let fixture: ComponentFixture<AssociationDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociationDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
