import { createWorker } from 'tesseract.js';
import { useRef, useState } from 'preact/hooks';
import { Word } from 'tesseract.js';
import './OcrTagger.css';

interface TaggedWord extends Word {
  label?: string;
}

const OcrTagger = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [boxes, setBoxes] = useState<TaggedWord[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);

  const [itemAttribute, setItemAttribute] = useState<"name" | "price" | "qty">("name");
  const [itemDetail, setItemDetail] = useState<{
    name: string;
    price: string;
    qty: string;
  }>({
    name: "",
    price: "",
    qty: "",
  });
  const [itemList, setItemList] = useState<{
    name: string;
    price: string;
    qty: string;
  }[]>([]);
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
      boxesToBe.forEach(
        box => {
          console.log("x position: ", box.bbox.x0);
          console.log("y position: ", box.bbox.y0);
        }
      )
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

  const onCancel = () => {
    setItemAttribute("name");
    setItemDetail({
      name: "",
      price: "",
      qty: "",
    });
    setInputValue("");
  }

  const submitAttrItem = () => {
    setItemAttribute(itemAttribute == "name" ? "price" : itemAttribute == "price" ? "qty" : "name");
    setItemDetail(prev => ({
      ...prev,
      [itemAttribute]: inputValue,
    }));
    if(itemAttribute == "qty"){
      setItemList(prev => [...prev, itemDetail]);
    }
    setItemDetail({
      name: "",
      price: "",
      qty: "",
    })
    setInputValue("");
  }

  const onClickHighlight = (text: string) => {
    setInputValue(prev => (
      prev.length > 0 ? prev + " " + text : text
    ));
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
              <div className="col-12">
                <div class="input-group">
                  <input type="text" class="form-control" value={inputValue} onChange={e => setInputValue((e.target as HTMLInputElement).value)} placeholder={`Input ${itemAttribute == "name" ? "Product Name" : itemAttribute == "price" ? "Price" : "Quantity"}`}/>
                  <button class="btn btn-danger" type="button" onClick={onCancel}>Cancel</button>
                  <button class="btn btn-primary" type="button" onClick={submitAttrItem}>Submit</button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

export default OcrTagger;
