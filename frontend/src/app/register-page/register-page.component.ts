import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CustomerService } from '../customer.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MustMatch} from '../utils/must-match.validator';
// import { MustMatch } from './_helpers/must-match.validator';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  error: any;

  constructor(
    private apiService: ApiService,
    private customerService: CustomerService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    if (this.customerService.isLogged()) {
      this.router.navigateByUrl('/dashboard');
    }
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }


  get f() { return this.registerForm.controls; }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      console.log('aaa')
      return;
    }

    // display form values on success
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));
    this.tryRegister();
  }

   tryRegister() {
     this.apiService.register(
       this.registerForm.controls.email.value,
       this.registerForm.controls.password.value,
    ).subscribe(
       res => {
        if (res.token) {
          this.customerService.setToken(res.token);
          window.location.reload();
          this.router.navigateByUrl('/dashboard');
        }
      },
      res => {
        this.error = res.error.error;
        console.log(res.error.error);
      });
  }}


