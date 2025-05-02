import { createWorker } from 'tesseract.js';
import { useRef, useState } from 'preact/hooks';
import { Word } from 'tesseract.js';
import './OcrTagger.css';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../redux/actions';
import { ItemProps } from '../redux/reducer';

interface TaggedWord extends Word {
  label?: string;
}

const OcrTagger = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [boxes, setBoxes] = useState<TaggedWord[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);

  const [itemAttribute, setItemAttribute] = useState<"name" | "price">("name");
  const [itemDetail, setItemDetail] = useState<{
    name: string;
    price: string;
  }>({
    name: "",
    price: "",
  });
  
  const dispatch = useDispatch();
  const itemList = useSelector((state: ItemProps[]) => state);
  ;
  const [inputValue, setInputValue] = useState<string>("");

  const handleFileChange = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = event.target?.result as string;
      setImageSrc(result);
      setBoxes([]);

      const worker = await createWorker();
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data } = await worker.recognize(result);
      const boxesToBe = data.words as TaggedWord[];
      setBoxes(boxesToBe);
    };
    reader.readAsDataURL(file);
  };

  const handleClickBox = (word: TaggedWord) => {
    onClickHighlight(word.label ? word.label : word.text);
  };

  const getScale = (): [number, number] => {
    const img = imageRef.current;
    if (!img) return [1, 1];

    // Get the rendered width and height of the image (after scaling by CSS)
    const renderedWidth = img.clientWidth;
    const renderedHeight = img.clientHeight;

    // Get the natural width and height (original image dimensions)
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    // Calculate the scaling factors for x and y
    const scaleX = renderedWidth / naturalWidth;
    const scaleY = renderedHeight / naturalHeight;

    return [scaleX, scaleY];
  };

  const onClear = () => {
    setInputValue("");
  }

  const submitAttrItem = () => {
    setItemAttribute(itemAttribute == "name" ? "price" : "name");
    let itemDetailToBe: ItemProps = {...itemDetail};
    setItemDetail(prev => {
      itemDetailToBe = {
        ...prev,
        ...(itemAttribute == "name" ?
        {name: inputValue} : 
        {price: inputValue}),
      }
      return itemDetailToBe;
    });
    if(itemAttribute == "price"){
      dispatch(addItem(itemDetailToBe))
      setItemDetail({
        name: "",
        price: "",
      })
    }
    setInputValue("");
  }

  const onClickHighlight = (text: string) => {
    setInputValue(prev => {
      const textToBe = prev.length > 0 ? prev + " " + text : text;
      return itemAttribute == "price" ? parseFloat(textToBe.replace(/[^0-9.]/g, '')).toString() : textToBe;
    });
  }

  return (
    <>
      <div className="row justify-content-center align-items-center flex-column py-4 h-100">
        <div className="col-auto">
          <h3>Upload a Bill Image</h3>
        </div>
        <div className="col w-100 position-relative overflow-auto">
          {
            !imageSrc && (
              <div className="position-absolute bottom-10 start-0 w-100">
                <input id="formFile" class="form-control" type="file" accept="image/*" onChange={handleFileChange} />
              </div>
            )
          }
          {
            imageSrc && (
              <div className="position-absolute top-0 start-0 w-100 h-100">
                <div id="position-relative d-inline">
                  <img src={imageSrc} ref={imageRef} style={{ maxWidth: '100%' }} />
                  {
                    boxes.map((word, i) => {
                      const [scaleX, scaleY] = getScale();
                      const x = word.bbox.x0 * scaleX;
                      const y = word.bbox.y0 * scaleY;
                      const width = (word.bbox.x1 - word.bbox.x0) * scaleX;
                      const height = (word.bbox.y1 - word.bbox.y0) * scaleY;
                      
                      return (
                        <div
                          key={i}
                          className="highlight-box"
                          style={{
                            left: `${x}px`,
                            top: `${y}px`,
                            width: `${width}px`,
                            height: `${height}px`,
                          }}
                          onClick={() => handleClickBox(word)}
                        >
                          {word.label ? `${word.label}: ${word.text}` : word.text}
                        </div>
                      );
                    })}
                </div>
              </div>
            )
          }
        </div>
      </div>
      {
        !!boxes.length && (
          <div className="button-actions py-3 bg-white">
            <div className="row justify-content-between">
              <div className="col-12 mb-3">
                Select text to Input {itemAttribute == "name" ? "Product Name" : itemAttribute == "price" ? "Price" : "Quantity"}
              </div>
              <div className="col-12 mb-3">
                <div class="input-group">
                  <input type="text" class="form-control" value={inputValue} onChange={e => setInputValue((e.target as HTMLInputElement).value)} placeholder={`Input ${itemAttribute == "name" ? "Product Name" : itemAttribute == "price" ? "Price" : "Quantity"}`}/>
                  <button class="btn btn-danger" type="button" onClick={onClear}>Clear</button>
                  <button class="btn btn-primary" type="button" onClick={submitAttrItem}>Submit</button>
                </div>
              </div>
              <div className="col-12">
                <button disabled={itemList.length < 1} className={`btn ${itemList.length < 1 ? "btn-secondary":"btn-success"} w-100`} type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasItemList" aria-controls="offcanvasItemList">
                  See Item List
                </button>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

export default OcrTagger;
