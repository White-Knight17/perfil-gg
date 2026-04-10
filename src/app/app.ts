import { Component } from '@angular/core';
import { Home } from './home/home';
import { Projects } from './projects/projects';
import { Skills } from './skills/skills';
import { Contact } from './contact/contact';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Home, Projects, Skills, Contact],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
