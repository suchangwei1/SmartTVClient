/// <reference path="../../declarations.d.ts"/>
import { HostListener, ElementRef, Directive} from '@angular/core';

@Directive({
  selector: '[myMarquee]'
})
export class  HomeDirective{

  htmlEl: HTMLElement;

  @HostListener('mouseenter') onMouseenter() {
    //console.log(this.htmlEl.parentElement.parentElement);
    new mouseenter(this.htmlEl.parentElement.parentElement);

  }

  @HostListener('mouseleave') onMouseleave() {
    //console.log(this.htmlEl.parentElement.parentElement);
    new mouseleave(this.htmlEl.parentElement.parentElement);

  }

  constructor(private el: ElementRef) {
    this.htmlEl = el.nativeElement;

  }

}
