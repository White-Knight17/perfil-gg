import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideQueryClient, QueryClient } from '@tanstack/angular-query-experimental';
import { Projects } from './projects';
import { setupBrowserMocks } from '../test-utils';

setupBrowserMocks();

@Component({ template: '', standalone: true })
class DummyComponent {}

describe('Projects', () => {
  let fixture: ComponentFixture<Projects>;
  let component: Projects;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Projects],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideQueryClient(new QueryClient({ defaultOptions: { queries: { retry: false } } }))],
    }).compileComponents();

    fixture = TestBed.createComponent(Projects);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
  it('should start in loading state', () => expect(component.isLoading()).toBe(true));
  it('should have projects signal', () => expect(component.projects()).toEqual([]));
  it('should have isEmpty signal', () => expect(component.isEmpty()).toBe(false)); // loading = not empty
  it('should return lang class', () => {
    expect(component.getLangClass('TypeScript')).toBe('lang-typescript');
    expect(component.getLangClass('Go')).toBe('lang-default');
    expect(component.getLangClass(null)).toBe('lang-default');
  });
  it('should have retry method', () => {
    expect(typeof component.retry).toBe('function');
  });
});
