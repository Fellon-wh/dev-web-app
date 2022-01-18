/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SokobanComponent } from './Sokoban.component';

describe('SokobanComponent', () => {
  let component: SokobanComponent;
  let fixture: ComponentFixture<SokobanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SokobanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SokobanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
