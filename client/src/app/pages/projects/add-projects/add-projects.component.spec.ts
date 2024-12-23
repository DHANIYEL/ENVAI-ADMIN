import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectsComponent } from './add-projects.component';

describe('AddProjectsComponent', () => {
  let component: AddProjectsComponent;
  let fixture: ComponentFixture<AddProjectsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddProjectsComponent]
    });
    fixture = TestBed.createComponent(AddProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
