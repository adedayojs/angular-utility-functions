import { Directive, Input, ViewContainerRef, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { NgForm, ControlContainer, FormGroup } from '@angular/forms';
import { takeWhile } from 'rxjs';

@Directive({
    selector: '[appShowIfInvalid]'
})
export class ShowIfInvalidDirective implements OnInit, OnDestroy {
    @Input('appShowIfInvalid') controlName!: string;

    isActive = true

    constructor(
        private viewContainerRef: ViewContainerRef,
        private templateRef: TemplateRef<any>,
        private controlContainer: ControlContainer
    ) { }

    ngOnInit() {

        const form = this.controlContainer.control as FormGroup;

        if (!form || !this.controlName) {
            console.error('Parent form or control name not found');
            return;
        }

        const control = form.get(this.controlName);

        if (!control) {
            console.error(`Control with name ${this.controlName} not found in the form`);
            return;
        }

        // Listen to changes in the control's state (dirty and invalid)
        control.statusChanges.pipe(takeWhile(() => this.isActive)).subscribe(() => {
            if (control.dirty && control.invalid) {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
            } else {
                this.viewContainerRef.clear();
            }
        });
    }

    ngOnDestroy(): void {
        this.isActive = false
    }

    private findParentForm(element: HTMLElement): NgForm | null {
        while (element.parentElement) {
            if (element.parentElement instanceof NgForm) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
        return null;
    }
}
