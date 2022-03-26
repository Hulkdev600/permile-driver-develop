import { ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import { CheckJoinAvailableComponent } from '../modals/join/insurance-information/check-join-available/check-join-available.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
    private componentRef!: ComponentRef<CheckJoinAvailableComponent>;
    private componentSubscriber!: Subject<string>;
  // private componentRef!: ComponentRef<ModalComponent>;
  // private componentSubscriber!: Subject<string>;
  constructor(private resolver : ComponentFactoryResolver) { }

  openModal(entry:ViewContainerRef, modalTitle:string, modalBody : string){
    let factory = this.resolver.resolveComponentFactory(CheckJoinAvailableComponent);
    this.componentRef = entry.createComponent(factory);
    this.componentRef.instance.title = modalTitle;
    this.componentRef.instance.body = modalBody;
    this.componentRef.instance.closeMeEvent.subscribe(() => this.closeModal());
    this.componentRef.instance.confirmEvent.subscribe(() => this.confirm());
    this.componentSubscriber = new Subject<string>();
    return this.componentSubscriber.asObservable();
  }

  closeModal() {
    this.componentSubscriber.complete();
    this.componentRef.destroy();
  }

  confirm() {
    this.componentSubscriber.next('confirm');
    this.closeModal();
  }
}
