import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatToolbarModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatIconModule, MatButtonModule, ToastrModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class NavBarComponent implements OnInit {
  @Input() yearArray: number[] | undefined
  @Output() filterChange = new EventEmitter()
  filters!: FormGroup;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.filters = new FormGroup({
      year: new FormControl('2017'), // TODO Latest year
    });

    this.filters.valueChanges.subscribe(res => {
      this.filterChange.emit(res)
    })
  }

  logout(): void {
    this.authService.logout()
  }
}
