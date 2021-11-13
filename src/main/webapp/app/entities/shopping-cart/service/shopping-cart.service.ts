import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IShoppingCart, getShoppingCartIdentifier } from '../shopping-cart.model';

export type EntityResponseType = HttpResponse<IShoppingCart>;
export type EntityArrayResponseType = HttpResponse<IShoppingCart[]>;

@Injectable({ providedIn: 'root' })
export class ShoppingCartService {
  public shoppingCarts: IShoppingCart[] = [];

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/shopping-carts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(shoppingCart: IShoppingCart): Observable<EntityResponseType> {
    return this.http.post<IShoppingCart>(this.resourceUrl, shoppingCart, { observe: 'response' });
  }

  update(shoppingCart: IShoppingCart): Observable<EntityResponseType> {
    return this.http.put<IShoppingCart>(`${this.resourceUrl}/${getShoppingCartIdentifier(shoppingCart) as number}`, shoppingCart, {
      observe: 'response',
    });
  }

  partialUpdate(shoppingCart: IShoppingCart): Observable<EntityResponseType> {
    return this.http.patch<IShoppingCart>(`${this.resourceUrl}/${getShoppingCartIdentifier(shoppingCart) as number}`, shoppingCart, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IShoppingCart>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IShoppingCart[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addShoppingCartToCollectionIfMissing(
    shoppingCartCollection: IShoppingCart[],
    ...shoppingCartsToCheck: (IShoppingCart | null | undefined)[]
  ): IShoppingCart[] {
    const shoppingCarts: IShoppingCart[] = shoppingCartsToCheck.filter(isPresent);
    if (shoppingCarts.length > 0) {
      const shoppingCartCollectionIdentifiers = shoppingCartCollection.map(
        shoppingCartItem => getShoppingCartIdentifier(shoppingCartItem)!
      );
      const shoppingCartsToAdd = shoppingCarts.filter(shoppingCartItem => {
        const shoppingCartIdentifier = getShoppingCartIdentifier(shoppingCartItem);
        if (shoppingCartIdentifier == null || shoppingCartCollectionIdentifiers.includes(shoppingCartIdentifier)) {
          return false;
        }
        shoppingCartCollectionIdentifiers.push(shoppingCartIdentifier);
        return true;
      });
      return [...shoppingCartsToAdd, ...shoppingCartCollection];
    }
    return shoppingCartCollection;
  }

  numberOfItemsInTheCart(): number {
    let itemCount = 0;
    this.shoppingCarts.forEach(shoppingCart => {
      if (shoppingCart.quantity) {
        itemCount += shoppingCart.quantity;
      }
    });
    return itemCount;
  }
}
