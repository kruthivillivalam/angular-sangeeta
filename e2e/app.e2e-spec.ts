import { OrderpointAngularPage } from './app.po';

describe('orderpoint-angular App', function() {
  let page: OrderpointAngularPage;

  beforeEach(() => {
    page = new OrderpointAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
