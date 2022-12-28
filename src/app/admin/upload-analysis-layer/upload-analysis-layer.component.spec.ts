import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAnalysisLayerComponent } from './upload-analysis-layer.component';

describe('UploadAnalysisLayerComponent', () => {
  let component: UploadAnalysisLayerComponent;
  let fixture: ComponentFixture<UploadAnalysisLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadAnalysisLayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadAnalysisLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
