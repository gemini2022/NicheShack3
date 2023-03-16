export class PageLoad {
    public pageNumber!: number;
    public itemsPerPage!: number;
  
    constructor(_pageNumber: number, _itemsPerPage: number) {
      this.pageNumber = _pageNumber;
      this.itemsPerPage = _itemsPerPage;
    }
  }