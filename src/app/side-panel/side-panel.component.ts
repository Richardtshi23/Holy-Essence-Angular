import { Component,Input , Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-side-panel',
  standalone: false,
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.css'
})
export class SidePanelComponent {

  @Input() isOpen: boolean = false;
  @Output() closePanel = new EventEmitter<void>();

  close() {
    this.closePanel.emit();
  }

}
