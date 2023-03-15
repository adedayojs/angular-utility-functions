import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { DownloadService } from '@services/download/download.service';
import { map, } from 'rxjs/operators';

@Directive({
  selector: '[appDownloadFile]'
})
export class DownloadFileDirective {

  @Input() url: string
  @Input() fileName: string

  @Output() loading = new EventEmitter<boolean>()

  constructor(private readonly downloadService: DownloadService) { }

  @HostListener('click')
  onClick(): void {
    this.loading.emit(true);
    this.downloadService.downloadFile(this.url)
      .pipe(
        map((response) => new Blob([response], { type: response.type }))
      )
      .subscribe((file: Blob) => {
        this.loading.emit(false)
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(file);
        link.download = this.fileName || 'Downloaded File'
        link.click();
      });
  }
}
