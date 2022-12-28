import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerDataInfoComponent } from './owner-data-info.component';

describe('OwnerDataInfoComponent', () => {
  let component: OwnerDataInfoComponent;
  let fixture: ComponentFixture<OwnerDataInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnerDataInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerDataInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
