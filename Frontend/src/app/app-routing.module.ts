import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { ContactComponent } from './contact/contact.component';
import { ProjectComponent } from './project/project.component';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { AuthGuard } from './guards/auth.guard';
import { EditComponent } from './edit/edit.component';
import { TeamComponent } from './team/team.component';
import { DepartmentComponent } from './department/department.component';


const routes: Routes = [
  { path: 'project', component: ProjectComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'edit', component: EditComponent },
  { path: 'team', component: TeamComponent, canActivate: [AuthGuard] },
  {path:'department',component:DepartmentComponent},
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), ReactiveFormsModule], // Use ReactiveFormsModule here
  exports: [RouterModule]
})
export class AppRoutingModule { }
