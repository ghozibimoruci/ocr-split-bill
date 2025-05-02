import { useSelector } from "react-redux";
import { ItemProps } from "../redux/reducer";
import { useEffect, useState } from "preact/hooks";
import "./PersonList.css";

const PersonList = (props: {setPeoplePayList: (peoplePayList: {
  name: string;
  total: number;
  tax: number;
  items: {
    name: string;
    price: string;
  }[];
}[]) => void}) => {
  const { setPeoplePayList } = props;

  const [inputValue, setInputValue] = useState<string>("");
  const [people, setPeople] = useState<string[]>([]);
  const [itemList, setItemList] = useState<{
    name: string;
    price: string;
    people: number[];
  }[]>(useSelector((state: ItemProps[]) => state).map(
      item => ({
        name: item.name,
        price: item.price,
        people: []
      }))
  );
  const [itemVoidLength, setItemVoidLength] = useState<number>(0);

  const onClickPeopleButton = (itemIndex: number, peopleIndex: number) => {
    setItemList(prev => {
      const itemListToBe = [...prev];
      const currentPeopleList = [...itemListToBe[itemIndex].people];
      if(currentPeopleList.includes(peopleIndex)){
        itemListToBe[itemIndex].people = currentPeopleList.filter(num => num != peopleIndex);
      }else{
        itemListToBe[itemIndex].people.push(peopleIndex);
      }
      return itemListToBe;
    })
  }

  const onDeletePersonButton = (itemIndex: number, peopleIndex: number) => {
    const remainingSavedPeopleIndex = itemList[itemIndex].people.filter(num => num != peopleIndex);
    const remainingSavedPeople = people.filter((_, idx) => remainingSavedPeopleIndex.includes(idx));
    const newPeople = people.filter((_, num) => num != peopleIndex);
    setPeople(newPeople);
    setItemList(prev => {
      const itemListToBe = [...prev];
      const peopleListToBe = newPeople.map((ppl, idx) => ({name: ppl, index: idx}));
      itemListToBe[itemIndex].people = peopleListToBe.filter(ppl => remainingSavedPeople.includes(ppl.name)).map(ppl => ppl.index);
      return itemListToBe;
    })
  }

  const onClear = () => {
    setInputValue("");
  }

  const onSubmitPeople = () => {
    setPeople(prev => {
      const peopleToBe = [...prev, inputValue];
      return peopleToBe;
    });
    setInputValue("");
  }

  const startSplitBill = () => {
    const splitBillPerson: {
      name: string;
      total: number;
      tax: number;
      items: {
        name: string;
        price: string;
      }[]
    }[] = [...people].map(ppl => ({
      name: ppl,
      tax: 0,
      total: 0,
      items: []
    }));
    splitBillPerson.forEach(
      (ppl, idx) => {
        itemList.forEach(
          (item) => {
            if(item.people.includes(idx)){
              const pplToPay = parseFloat(item.price) / item.people.length;
              ppl.total += parseFloat(pplToPay.toFixed(3));
              ppl.items.push({
                name: item.name,
                price: pplToPay.toFixed(3)
              })
            }
          }
        )
      }
    );
    setPeoplePayList(splitBillPerson);
  }

  useEffect(() => {
    setItemVoidLength(itemList.filter(item => item.people.length < 1).length);
  }, [itemList])

  return (
    <>
      <div className="row justify-content-center align-items-center flex-column py-4 h-100">
        <div className="col-auto">
          <h3>Put People in the List</h3>
        </div>
        <div className="col w-100 position-relative overflow-auto">
          {
            itemList.map(
              (item, idx) => (
                <div key={idx} className="py-2">
                  <div className="row mb-2">
                    <div className="col">{item.name}</div>
                    <div className="col-auto">{item.price}</div>
                  </div>
                  <div className="row">
                    {
                      people.map(
                        (ppl, jdx) => (
                          <div key={jdx} className="col-auto py-3">
                            <div className="btn-group">
                              <button type="button" onClick={() => onClickPeopleButton(idx, jdx)} className={`btn ${item.people.includes(jdx)?"btn-success":"btn-outline-secondary"} position-relative`}>
                                {ppl}
                              </button>
                              <button onClick={() => onDeletePersonButton(idx, jdx)} className="btn btn-danger px-2 d-flex align-items-center justify-content-center">
                                x
                              </button>
                            </div>
                          </div>
                        )
                      )
                    }
                  </div>
                </div>
              )
            )
          }
        </div>
      </div>
      <div className="position-sticky bottom-0 left-0 py-3 bg-white">
        <div className="row justify-content-between">
          <div className="col-12 mb-3">
            Input People Name
          </div>
          <div className="col-12 mb-3">
            <div class="input-group">
              <input type="text" class="form-control" value={inputValue} onChange={e => setInputValue((e.target as HTMLInputElement).value)} placeholder={`Input People Name`}/>
              <button class="btn btn-danger" type="button" onClick={onClear}>Clear</button>
              <button class="btn btn-primary" type="button" onClick={onSubmitPeople}>Submit</button>
            </div>
          </div>
          <div className="col-12">
            <button disabled={itemVoidLength > 0} className={`btn ${itemVoidLength > 0 ? "btn-secondary":"btn-success"} w-100`} type="button" onClick={startSplitBill}>
              Share Bill
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonList;
