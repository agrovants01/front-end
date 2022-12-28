import { Component, ElementRef, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserList } from '../../users/users.interface';
import '../../../shared/validators/patterns';
import { namePattern, numericPattern, usernamePattern, emailPattern, phonePattern } from '../../../shared/validators/patterns';
import { ProfileList } from '../../services/profiles.interface';
import { AdminService } from '../../services/admin.service';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { cancelAlert, confirmAlert, errorAlert } from '../../../shared/services/alerts';

//Data from parent components
export interface DialogUserFormData {
  title: string;
  user: UserList | undefined;
}

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: []
})

export class UserFormComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();

  title: string = ''; //Title of the form

  userForm: FormGroup = this.fb.group({
    nombreUsuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(namePattern)]],
    apellidoUsuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(namePattern)]],
    aliasUsuario: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(usernamePattern)]],
    emailUsuario: ['', [Validators.required, Validators.email, Validators.pattern(emailPattern)]],
    telefonoUsuario: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(50), Validators.pattern(phonePattern)]],
    cuitUsuario: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(50), Validators.pattern(numericPattern)]],
    perfilUsuario: ['', [Validators.required]]
  });

  //Get the avalibles profiles
  profiles: Observable<ProfileList[]> = new Observable<ProfileList[]>((observer) => {
    this._adminService.getUsuerProfiles()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((profiles: ProfileList[]) => {
        observer.next(profiles);
      }, error => {
        console.log(error);
        errorAlert('No se pudo recuperar el listado de perfiles').then(() => {
          observer.complete();
          this.dialogRef.close();
        })
      })
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public userFormData: DialogUserFormData,
    private _adminService: AdminService
  ) { }

  ngOnInit(): void {

    //Set the title
    this.title = this.userFormData.title;

    //If the parent is edit, fill the form with the user data
    if (this.userFormData.user) {
      this.userForm.reset({
        nombreUsuario: this.userFormData.user?.nombreUsuario,
        apellidoUsuario: this.userFormData.user?.apellidoUsuario,
        aliasUsuario: this.userFormData.user?.aliasUsuario,
        emailUsuario: this.userFormData.user?.emailUsuario,
        telefonoUsuario: this.userFormData.user?.telefonoUsuario,
        cuitUsuario: this.userFormData.user?.cuitUsuario,
        perfilUsuario: this.userFormData.user?.perfilUsuario,
      });
      this.setProfileValue(this.userFormData.user?.perfilUsuario);
    }

  }

  /** Error Status checking and messages **/

  notValidField(field: string) {
    return (
      this.userForm.controls[field].errors &&
      this.userForm.controls[field].touched
    );
  }

  get nombreErrorMsg(): string {
    const errors = this.userForm.get('nombreUsuario')?.errors;
    if (errors?.required) {
      return 'Este campo es obligatorio';
    } else if (errors?.maxlength || errors?.minlength) {
      return 'Este campo debe tener de 3 a 50 caracteres';
    } else if (errors?.pattern) {
      return 'Sólo se permiten caracteres alfabéticos';
    }

    return ''; //Para evitar errores
  }

  get apellidoErrorMsg(): string {
    const errors = this.userForm.get('apellidoUsuario')?.errors;
    if (errors?.required) {
      return 'Este campo es obligatorio';
    } else if (errors?.maxlength || errors?.minlength) {
      return 'Este campo debe tener de 3 a 50 caracteres';
    } else if (errors?.pattern) {
      return 'Sólo se permiten caracteres alfabéticos';
    }

    return ''; //Para evitar errores
  }

  get aliasErrorMsg(): string {
    const errors = this.userForm.get('aliasUsuario')?.errors;
    if (errors?.required) {
      return 'Este campo es obligatorio';
    } else if (errors?.maxlength || errors?.minlength) {
      return 'Este campo debe tener de 3 a 50 caracteres';
    } else if (errors?.pattern) {
      return 'Sólo se permiten caracteres alfanuméricos';
    }

    return ''; //Para evitar errores
  }

  get emailErrorMsg(): string {
    const errors = this.userForm.get('emailUsuario')?.errors;
    if (errors?.required) {
      return 'Este campo es obligatorio';
    } else if (errors?.pattern) {
      return 'El formato no es válido';
    }

    return ''; //Para evitar errores
  }

  get telefonoErrorMsg(): string {
    const errors = this.userForm.get('telefonoUsuario')?.errors;
    if (errors?.required) {
      return 'Este campo es obligatorio';
    } else if (errors?.maxlength || errors?.minlength) {
      return 'Este campo debe tener de 7 a 50 caracteres';
    } else if (errors?.pattern) {
      return 'El formato no es válido';
    }

    return ''; //Para evitar errores
  }

  get cuitErrorMsg(): string {
    const errors = this.userForm.get('cuitUsuario')?.errors;
    if (errors?.required) {
      return 'Este campo es obligatorio';
    } else if (errors?.pattern || errors?.maxlength || errors?.minlength) {
      return 'El formato no es válido';
    }

    return ''; //Para evitar errores
  }

  get perfilErrorMsg(): string {
    const errors = this.userForm.get('perfilUsuario')?.errors;
    if (errors?.required) {
      return 'Este campo es obligatorio';
    }

    return ''; //Para evitar errores
  }

  /** Actions **/

  cancel(): void {

    cancelAlert()
      .then((result: any) => {
        if (result.isConfirmed) {
          //Return to the parent
          this.dialogRef.close();
        }
      });


  }

  onSubmit(): void {

    //If it's empty then show errors
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    confirmAlert()
      .then((result: any) => {
        if (result.isConfirmed) {
          //Return the form data to the parent
          let output: UserList = this.userForm.value;
          if (this.userFormData.user) {
            output.usuarioId = this.userFormData.user!.usuarioId;
          }
          this.dialogRef.close(output);
        }
      });

  }

  setProfileValue(profileName: string | undefined) {
    this.profiles
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((profiles: ProfileList[]) => {
        if (profileName) {
          profiles.forEach((profile: ProfileList) => {
            if (profile.nombrePerfil === profileName) {
              this.userForm.get('perfilUsuario')?.patchValue(profile.perfilId);
              return;
            }
          });
        }
        return;
      })
    return;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}
