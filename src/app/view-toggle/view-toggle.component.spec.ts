import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewToggleComponent } from './view-toggle.component';

describe('ViewToggleComponent', () => {
    let component: ViewToggleComponent;
    let fixture: ComponentFixture<ViewToggleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ViewToggleComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ViewToggleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
