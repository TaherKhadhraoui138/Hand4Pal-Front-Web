import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationProfile } from './association-profile';

describe('AssociationProfile', () => {
  let component: AssociationProfile;
  let fixture: ComponentFixture<AssociationProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociationProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
