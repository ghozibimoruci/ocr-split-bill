import { useEffect, useRef, useState } from "preact/hooks";
import html2canvas from 'html2canvas';
import "./PersonList.css";

const SplitText = (props: { peoplePayList: {
  name: string;
  total: number;
  tax: number;
  items: {
    name: string;
    price: string;
  }[];
}[], setPeoplePayList: (peoplePayList: {
  name: string;
  total: number;
  tax: number;
  items: {
    name: string;
    price: string;
  }[];
}[]) => void }) => {
  const { peoplePayList, setPeoplePayList } = props;
  const [inputValue, setInputValue] = useState<string>("");
  const captureRef = useRef<HTMLDivElement>(null);

  const onClear = () => {
    setInputValue("");
  }

  const handleCapture = async () => {
    if (!captureRef.current) return;
    const canvas = await html2canvas(captureRef.current);
    const imgData = canvas.toDataURL('image/png');

    // Optionally trigger download
    const link = document.createElement('a');
    link.href = imgData;
    link.download = 'screenshot.png';
    link.click();
  };

  useEffect(() => {
    if(inputValue){
      // sum of peopletopay total
      const total = peoplePayList.reduce((acc, cur) => acc + cur.total, 0);
      const percentageTax = parseFloat(inputValue) / total;
      setPeoplePayList(peoplePayList.map(data => ({
        ...data,
        tax: data.total * percentageTax
      })))
    }else{
      setPeoplePayList(peoplePayList.map(data => ({
        ...data,
        tax: 0
      })))
    }
  }, [inputValue]);

  return (
    <>
      <div className="row justify-content-center align-items-center flex-column py-4 h-100">
        <div className="col-auto">
          <h3>Put People in the List</h3>
        </div>
        <div className="col w-100 position-relative overflow-auto">
          <div ref={captureRef} className="p-2">
            {
              peoplePayList.map(
                (ppl, idx) => (
                  <div key={idx} className="row mb-4">
                    <div className="col-12 mb-3 fw-bold">
                      {ppl.name}
                    </div>
                    <div className="col-12">
                      {
                        ppl.items.map(
                          (item, jdx) => (
                            <div key={jdx} className="row mb-2">
                              <div className="col">
                                {item.name}
                              </div>
                              <div className="col-auto">
                                {item.price}
                              </div>
                            </div>
                          )
                        )
                      }
                      {
                        ppl.tax > 0 && (
                          <div className="row mb-2">
                            <div className="col">
                              tax
                            </div>
                            <div className="col-auto">
                              {ppl.tax.toFixed(3)}
                            </div>
                          </div>
                        )
                      }
                      <div className="row border-top fw-bold">
                        <div className="col">
                          Total: 
                        </div>
                        <div className="col-auto">
                          {ppl.total + parseFloat(ppl.tax.toFixed(3))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )
            }
          </div>
        </div>
      </div>
      <div className="position-sticky bottom-0 left-0 py-3 bg-white">
        <div className="row justify-content-between">
          <div className="col-12 mb-3">
            Input Other Service
          </div>
          <div className="col-12 mb-3">
            <div class="input-group">
              <input type="number" class="form-control" value={inputValue} onChange={e => setInputValue((e.target as HTMLInputElement).value)} placeholder={`Input Other Service`}/>
              <button class="btn btn-danger" type="button" onClick={onClear}>Clear</button>
            </div>
          </div>
          <div className="col-12">
            <button className={`btn btn-success w-100`} type="button" onClick={handleCapture}>
              Share Screenshot
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SplitText;
