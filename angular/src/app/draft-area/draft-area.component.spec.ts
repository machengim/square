import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftAreaComponent } from './draft-area.component';

describe('DraftAreaComponent', () => {
  let component: DraftAreaComponent;
  let fixture: ComponentFixture<DraftAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
