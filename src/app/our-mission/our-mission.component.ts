import { Component, OnInit, OnDestroy, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-our-mission',
  templateUrl: './our-mission.component.html',
  styleUrls: ['./our-mission.component.css'],
  standalone: false
})
export class OurMissionComponent implements OnInit, OnDestroy {
  private observer!: IntersectionObserver;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 }); // Trigger when 10% of the element is visible

    const elements = this.el.nativeElement.querySelectorAll('.animate-on-scroll');
    elements.forEach((el: Element) => this.observer.observe(el));
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
