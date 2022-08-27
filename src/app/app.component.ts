import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public readonly form: FormGroup<{
    answer: FormControl<string>;
  }>;
  public readonly response$: Observable<boolean>;
  private readonly responseSubject = new Subject<boolean>();

  public constructor(fb: FormBuilder) {
    this.form = fb.nonNullable.group({
      answer: fb.nonNullable.control('', Validators.required),
    });

    this.response$ = this.responseSubject.asObservable();

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.responseSubject.next(false);
      this.form.setErrors(null);
    });
  }

  public submit(): void {
    console.log(this.form.value.answer?.toLowerCase());

    if (this.form.value.answer?.toLowerCase() === 'kelvin') {
      this.responseSubject.next(true);
    } else {
      this.form.setErrors({
        invalid: true,
      });
    }
  }
}
