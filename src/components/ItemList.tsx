import './ItemList.css';
import { useDispatch, useSelector } from 'react-redux';
import { ItemProps } from '../redux/reducer';
import { removeItem } from '../redux/actions';
import { PageModeEnum } from '../props/props-base';

const ItemList = (props : {setPageMode: (mode: PageModeEnum) => void}) => {
  const { setPageMode } = props;
  const dispatch = useDispatch();
  const itemList = useSelector((state: ItemProps[]) => state);

  const handleDeleteItem = (index: number) => {
    dispatch(removeItem(index))
  }

  return (
    <>
      <div className="offcanvas offcanvas-end" data-bs-backdrop="static" id="offcanvasItemList">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Item List</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body overflow-auto position-relative">
          {
            itemList.map(
              (item, idx) => (
                <div key={idx} className="row py-2 align-items-center">
                  <div className="col">
                    {item.name} - {item.price}
                  </div>
                  <div className="col-auto">
                    <button type="button" className="btn btn-danger" onClick={() => handleDeleteItem(idx)}>Delete</button>
                  </div>
                </div>
              )
            )
          }
          <button type="button" className="btn btn-primary position-absolute bottom-0 end-0 mb-2 mx-2" data-bs-dismiss="offcanvas" onClick={() => setPageMode(PageModeEnum.PERSON)}>Done</button>
        </div>
      </div>
    </>
  );
};

export default ItemList;
