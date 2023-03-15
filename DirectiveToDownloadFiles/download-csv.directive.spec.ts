import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DownloadService } from '@services/download/download.service';
import { of } from 'rxjs';
import { DownloadFileDirective } from './download-csv.directive';

@Component({
  template: `
  <a class="directive-test-component1" appDownloadFile url="https://example.com" fileName="fiename.csv" > Download Button </a>
  <a class="directive-test-component2" appDownloadFile url="https://example.com" > Download Button </a>
  `
})
class TestComponent { }


describe('DownloadFileDirective', () => {
  let fixture: ComponentFixture<TestComponent>
  let allDirectiveElements: Array<DebugElement>
  let downloadServiceSpy: jasmine.SpyObj<DownloadService>

  beforeEach(() => {
    downloadServiceSpy = jasmine.createSpyObj(DownloadService.name, { downloadFile: of(new Blob([])) })
    fixture = TestBed.configureTestingModule({
      declarations: [DownloadFileDirective, TestComponent],
      providers: [
        { provide: DownloadService, useValue: downloadServiceSpy }
      ]
    })
      .createComponent(TestComponent);

    fixture.detectChanges(); // initial binding

    // Element with an attached HighlightDirective
    allDirectiveElements = fixture.debugElement.queryAll(By.directive(DownloadFileDirective));
  });

  // Quantity tests
  it('should create two instance', () => {
    expect(allDirectiveElements[0]).toBeTruthy()
    expect(allDirectiveElements[1]).toBeTruthy()
    expect(allDirectiveElements.length).toBe(2);
  });

  it('should call service method to download file', () => {
    // Arrange
    // easier to work with nativeElement
    const anchor: HTMLAnchorElement = allDirectiveElements[0].nativeElement;

    // Action
    // Dispatch a DOM event so that Angular responds to the input value change.
    anchor.click()

    // Assert
    expect(downloadServiceSpy.downloadFile).toHaveBeenCalledTimes(1)
  });

  it('should create another anchor element which will anchor the file to be downloaded', () => {
    // Arrange
    const anchor: HTMLAnchorElement = allDirectiveElements[0].nativeElement;
    spyOn(document, 'createElement')

    // Action. Dispatch a DOM event so that Angular responds to the input value change.
    anchor.click()

    // Assert
    expect(document.createElement).toHaveBeenCalledTimes(1)
  });

  it('should create another anchor element which will anchor the file to be downloaded with default filename', () => {
    // Arrange
    const anchor: HTMLAnchorElement = allDirectiveElements[1].nativeElement;
    spyOn(document, 'createElement')

    // Action. Dispatch a DOM event so that Angular responds to the input value change.
    anchor.click()

    // Assert
    expect(document.createElement).toHaveBeenCalledTimes(1)
  });

});



