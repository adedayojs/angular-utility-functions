import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, Directive } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, NgForm } from '@angular/forms';
import { ShowIfInvalidDirective } from './show-if-invalid.directive';

@Component({
    template: `
    <form [formGroup]="form">
      <input type="text" formControlName="myControl">
      <div *appShowIfInvalid="myControlName">This field is required.</div>
    </form>
  `
})
class TestComponent {
    form: FormGroup;

    constructor() {
        this.form = new FormGroup({
            myControl: new FormControl('', Validators.required)
        });
    }

    get myControlName(): string {
        return 'myControl';
    }
}

describe('ShowIfInvalidDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent, ShowIfInvalidDirective],
            imports: [FormsModule, ReactiveFormsModule]
        });

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
    });

    it('should create an instance', () => {
        const directive = new ShowIfInvalidDirective(null, null, null);
        expect(directive).toBeTruthy();
    });

    it('should show error message when the control is invalid', () => {
        fixture.detectChanges();
        const errorMessage = fixture.nativeElement.querySelector('div');
        expect(errorMessage).toBeTruthy();
    });

    it('should hide error message when the control is valid', () => {
        component.form.get('myControl').setValue('valid value');
        fixture.detectChanges();
        const errorMessage = fixture.nativeElement.querySelector('div');
        expect(errorMessage).toBeNull();
    });

    it('should hide error message when the control is untouched', () => {
        component.form.get('myControl').markAsUntouched();
        fixture.detectChanges();
        const errorMessage = fixture.nativeElement.querySelector('div');
        expect(errorMessage).toBeNull();
    });

    it('should hide error message when the control is pristine', () => {
        component.form.get('myControl').markAsPristine();
        fixture.detectChanges();
        const errorMessage = fixture.nativeElement.querySelector('div');
        expect(errorMessage).toBeNull();
    });
});
