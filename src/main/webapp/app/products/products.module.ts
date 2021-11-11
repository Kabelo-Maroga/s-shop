import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { PRODUCTS_ROUTE } from './products.route';
import { ProductsComponent } from './products.component';
import { ProductCardModule } from '../product-card/product-card.module';
import { FilterModule } from './filter/filter.module';

@NgModule({
  imports: [SharedModule, ProductCardModule, RouterModule.forChild([PRODUCTS_ROUTE]), FilterModule],
  declarations: [ProductsComponent],
})
export class ProductsModule {}
