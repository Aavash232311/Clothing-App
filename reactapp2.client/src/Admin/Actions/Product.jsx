import React, { Component } from "react";
import {
  ClassicEditor,
  AccessibilityHelp,
  Autosave,
  Bold,
  Essentials,
  GeneralHtmlSupport,
  Italic,
  Paragraph,
  SelectAll,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextPartLanguage,
  Undo,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import "../../static/product.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Services from "../../utils/utils";

export class CategoryHierarchy extends Component {
  // category does not saves in the db bug
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.depthOrderFetch = this.depthOrderFetch.bind(this);
    this.backLink = this.backLink.bind(this);
    this.selectCategory = this.selectCategory.bind(this);
    this.getSelected = this.getSelected.bind(this);
  }
  getSelected() {
    return this.getSelected;
  }
  state = {
    value: null,
    search: null,
    firstOrder: null,
    orders: [],
    selected: null,
  };
  componentDidMount() {
    fetch("public/category-hierarchy-intial-first-order", {
      method: "get",
      credentials: "include",
      headers: {
        "Content-Tpye": "application/json",
      },
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        const { statusCode, value } = response;
        if (statusCode == 200) {
          this.setState({
            value,
            firstOrder: value,
            orders: [{ name: "categories" }],
          });
        }
      });
  }
  depthOrderFetch(id, name) {
    fetch(`public/category-depthin?parentId=${id}`, {
      method: "get",
      credentials: "include",
      headers: {
        "Content-Tpye": "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        const { statusCode, value } = response;
        if (statusCode === 200) {
          const { children } = value;
          if (children.length === 0) return;
          this.setState({ value: children }, () => {
            this.setState((prevState) => ({
              orders: [
                ...prevState.orders,
                { id, name, value: this.state.value },
              ],
            })); // string value to reduce fetch call
          });
        }
      });
  }
  update(ev) {
    const { name, value } = ev.target;
    if (name === "search") {
      if (value === "") {
        this.setState({ value: this.state.firstOrder });
        return;
      }
      fetch(`public/search-category-all-orders?search=${value}`, {
        method: "get",
        credentials: "include",
        headers: {
          "Content-Tpye": "application/json",
        },
      })
        .then((rsp) => rsp.json())
        .then((response) => {
          const { statusCode, value } = response;
          if (statusCode == 200) {
            this.setState({ value });
          }
        });
    }
  }
  backLink = (id, value, name) => {
    const getProductIndex = [...this.state.orders];
    const newArr = [];
    for (let i = 0; i <= getProductIndex.length - 1; i++) {
      newArr.push(getProductIndex[i]);
      if (getProductIndex[i].id === id) {
        break;
      }
    }
    if (name === "categories") {
      this.setState({ orders: newArr, value: this.state.firstOrder });
      return;
    }
    this.setState({ orders: newArr, value });
  };
  selectCategory = (id, name) => {
    this.setState({ selected: { id, name } }, () => {
      this.setState({ orders: [], value: this.state.firstOrder }); // got to intial phase
      this.props.onValueChange({ id, name });
    });
  };
  render() {
    return (
      <>
        {this.state.value !== null ? (
          <>
            <input
              className="product-input classic-input"
              placeholder="search"
              name="search"
              autoComplete="off"
              style={{ marginBottom: "5px" }}
              onInput={this.update}
            ></input>
            {this.state.selected !== null ? (
              <span className="backward-propagation">
                <b>selected: </b> {this.state.selected.name}
              </span>
            ) : null}
            <br />
            {this.state.orders.length > 0 ? (
              <>
                {this.state.orders.map((i, j) => {
                  return (
                    <span
                      onClick={() => {
                        this.backLink(i.id, i.value, i.name);
                      }}
                      className="backward-propagation"
                      key={j}
                    >
                      {i.name}{" "}
                    </span>
                  );
                })}
              </>
            ) : null}
            {this.state.value.map((i, j) => {
              return (
                <div className="classic-label category-hierarchy" key={j}>
                  <span
                    onClick={() => {
                      this.selectCategory(i.id, i.productCategory);
                    }}
                  >
                    {i.productCategory}
                  </span>
                  <span
                    onClick={() => {
                      this.depthOrderFetch(i.id, i.productCategory);
                    }}
                    style={{ float: "right" }}
                  >
                    {">"}
                  </span>
                </div>
              );
            })}
          </>
        ) : null}
      </>
    );
  }
}

const Remove = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-x-octagon-fill"
      viewBox="0 0 16 16"
    >
      <path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353zm-6.106 4.5L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708" />
    </svg>
  );
};

class Product extends Component {
  state = {
    isLayoutReady: false,
    Description: null,
    Name: null,
    imageCount: 0,
    tags: [],
    setTag: "",
    Category: null,
    OptionsExpand: false,
    InStock: true,
    Price: null,
    Height: null,
    Length: null,
    Breadth: null,
    Gender: "male",
    page: 1,
    product: [],
  };
  CategoryRef = React.createRef();
  NameRef = React.createRef();
  DescriptionRef = React.createRef();
  PriceRef = React.createRef();
  HeightRef = React.createRef();
  LengthRef = React.createRef();
  BreadthRef = React.createRef();
  ImageRef = React.createRef();
  services = new Services();
  submit = (ev) => {
    ev.preventDefault();
    // category cannot be null
    // we will render backend error as well and implement proper error handeling
    const Images = [];
    const elem = document.getElementsByClassName("images-file");
    for (let i = 0; i <= elem.length - 1; i++) {
      Images.push(elem[i].files[0]);
    }
    const Category = this.state.Category.id;
    // some required fields
    if (
      this.state.Category === null ||
      this.state.Name === null ||
      this.state.Description === null ||
      this.state.Price === null ||
      this.state.Height === null ||
      this.state.Length === null ||
      this.state.Breadth === null
    ) {
      if (!this.state.Category)
        this.CategoryRef.current.style.border = "1px solid red";
      if (!this.state.Name) this.NameRef.current.style.border = "1px solid red";
      if (!this.state.Description)
        this.DescriptionRef.current.style.border = "1px solid red";
      if (!this.state.Price)
        this.PriceRef.current.style.border = "1px solid red";
      if (!this.state.Height)
        this.HeightRef.current.style.border = "1px solid red";
      if (!this.state.Length)
        this.LengthRef.current.style.border = "1px solid red";
      if (!this.state.Breadth)
        this.BreadthRef.current.style.border = "1px solid red";
      if (this.state.Image === 0)
        this.ImageRef.current.style.border = "1px solid red";
      return;
    }
    const formData = new FormData();
    this.setState({ Images }, () => {
      Object.entries(this.state).forEach(([key, value]) => {
        if (key != "Options") {
          // we will deal with structuring this later
          if (
            Array.isArray(value) &&
            value.length > 0 &&
            value[0] instanceof File
          ) {
            value.forEach((file) => {
              formData.append(`product.${key}`, file); // for file we append file and for image we append image
            });
          } else {
            // for key value our beautiful backend if kinda different so
            formData.append(`product.${key}`, value);
          }
        } else {
          const optionsList = this.state[key];
          for (let i in optionsList) {
            const obj = optionsList[i];
            for (let j in obj) {
              formData.append(`options[${parseInt(i)}].${j}`, obj[j]);
            }
          }
        }
      });

      fetch("staff/complex-product-form", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.services.getToken()}`,
        },
        body: formData,
      })
        .then((rsp) => rsp.json())
        .then((response) => {
          const { statusCode, value } = response;
        });
    });
  };

  unsetExpandOptions = () => {
    this.setState({ OptionsExpand: false });
  };
  addItem = () => {
    this.setState((prevState) => ({
      tags: [...prevState.tags, this.state.setTag],
    }));
    this.setState({ setTag: "" });
  };
  update(ev) {
    const { name, value } = ev.target;
    this.setState({ [name]: value });
  }
  componentDidMount() {
    this.setState({ isLayoutReady: true }, () => {
      this.fetchProductByPage(this.state.page);
    });
  }

  fetchProductByPage = (page) => {
    if (find === undefined) {
      fetch(`/staff/product-table?page=${page}`, {
        method: "get",
        headers: {
          Authorization: `Bearer ${this.services.getToken()}`,
          "Content-Tpe": "application/json",
        },
      })
        .then((rsp) => rsp.json())
        .then((response) => {
          const { value, statusCode } = response;
          if (statusCode !== 200) return;
          // product = {page: ..., value: ...}
          // optimization
          if (page === 1) {
            this.setState({product: {
              page: page,
              value
            }});
            return;
          }
          this.setState(
            (p) => ({
              product: [
                ...p.product,
                {
                  page: this.state.page,
                  value,
                },
              ],
            }),
            () => {}
          );
        });
    }
  };
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.addItem = this.addItem.bind(this);
    this.update = this.update.bind(this);
    this.unsetExpandOptions = this.unsetExpandOptions.bind(this);
    this.submit = this.submit.bind(this);
    this.fetchProductByPage = this.fetchProductByPage.bind(this);
  }
  deleteImageDom(ev) {
    let node = ev.target;
    while (node && !node.classList.contains("images-preview")) {
      node = node.parentNode;
    }
    if (node && node.classList.contains("images-preview")) {
      node.remove();
    }
  }
  render() {
    const editorConfig = {
      toolbar: {
        items: [
          "undo",
          "redo",
          "|",
          "selectAll",
          "textPartLanguage",
          "|",
          "bold",
          "italic",
          "|",
          "insertTable",
          "|",
          "accessibilityHelp",
        ],
        shouldNotGroupWhenFull: false,
      },
      plugins: [
        AccessibilityHelp,
        Autosave,
        Bold,
        Essentials,
        GeneralHtmlSupport,
        Italic,
        Paragraph,
        SelectAll,
        Table,
        TableCaption,
        TableCellProperties,
        TableColumnResize,
        TableProperties,
        TableToolbar,
        TextPartLanguage,
        Undo,
      ],
      htmlSupport: {
        allow: [
          {
            name: /^.*$/,
            styles: true,
            attributes: true,
            classes: true,
          },
        ],
      },
      menuBar: {
        isVisible: true,
      },
      placeholder: "Product description!",
      table: {
        contentToolbar: [
          "tableColumn",
          "tableRow",
          "mergeTableCells",
          "tableProperties",
          "tableCellProperties",
        ],
      },
    };
    let start = 0;
    let end = this.state.imageCount;
    const range = Array.from(
      { length: end - start + 1 },
      (_, index) => start + index
    );
    const PictureIcon = () => {
      return (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-card-image"
            viewBox="0 0 16 16"
          >
            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
            <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54L1 12.5v-9a.5.5 0 0 1 .5-.5z" />
          </svg>
        </>
      );
    };
    const Trash = () => {
      return (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-trash"
            viewBox="0 0 16 16"
          >
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
          </svg>
        </>
      );
    };

    const Preview = (ev) => {
      const dom = ev.target.parentNode;
      dom.style.backgroundImage = `url("${URL.createObjectURL(
        ev.target.files[0]
      )}")`;
      dom.style.backgroundRepeat = "no-repeat";
      dom.style.backgroundSize = "cover";
      dom.style.backgroundPosition = "center";
    };
    const removeTags = (index) => {
      const curr = [...this.state.tags];
      this.setState({ tags: curr.filter((x) => x != curr[index]) });
    };
    return (
      <div
        style={{
          backgroundColor: "#f6f5f7",
          height: "auto",
          overflow: "hidden",
        }}
      >
        <div id="product-form-grid">
          <div>
            <div className="label-product">
              Product Name <span className="methyl-orange">*</span>{" "}
            </div>
            <div className="dual-input">
              <div>
                <input
                  className="product-input classic-input"
                  placeholder="name"
                  name="Name"
                  autoComplete="off"
                  ref={this.NameRef}
                  onInput={this.update}
                ></input>
              </div>
              <div>
                <input
                  className="product-input classic-input"
                  placeholder="SKU"
                  name="SKU"
                  autoComplete="off"
                  onInput={this.update}
                ></input>
              </div>
            </div>

            <div className="label-product">
              Description <span className="methyl-orange">*</span>{" "}
            </div>

            <div ref={this.DescriptionRef} className="product-input">
              <div className="editor-container editor-container_classic-editor">
                <div className="editor-container__editor">
                  <div>
                    {this.state.isLayoutReady && (
                      <CKEditor
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          this.setState({ Description: data });
                        }}
                        editor={ClassicEditor}
                        config={editorConfig}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="label-product">Brand </div>
            <input
              className="product-input classic-input"
              placeholder="Brand"
              name="Brand"
              autoComplete="off"
              onInput={this.update}
            ></input>

            <div className="label-product">
              Gender (Blank if not clothing product)
            </div>
            <select
              className="product-input classic-input"
              placeholder="Gender"
              name="Gender"
              defaultValue="male"
              onInput={this.update}
            >
              <option value={"male"}>Male</option>
              <option value={"female"}>Female</option>
              <option value={"none"}> </option>
            </select>
            <div className="label-product">Shipping Notes</div>
            <input
              className="product-input classic-input"
              placeholder="ex: glass product be careful when shpiing!"
              name="ShippingNotes"
              autoComplete="off"
              onInput={this.update}
            ></input>

            <div className="label-product">Warranty Info</div>
            <input
              className="product-input classic-input"
              placeholder="warranty info"
              name="WarrantyInfo"
              autoComplete="off"
              onInput={this.update}
            ></input>
            <div className="label-product">
              In Stock <span className="methyl-orange">*</span>{" "}
            </div>
            <select
              className="product-input classic-input"
              placeholder="In stock"
              name="InStock"
              defaultValue="true"
              onInput={this.update}
            >
              <option value={"true"}>True</option>
              <option value={"false"}>False</option>
            </select>
            <div className="label-product">
              Images{" "}
              <span
                onClick={() => {
                  if (this.state.imageCount + 1 >= 20) {
                    alert("Less that 20");
                    return;
                  }
                  this.setState({ imageCount: this.state.imageCount + 1 });
                }}
                id="add-images"
                style={{ justifyContent: "left" }}
              >
                add
              </span>
              <span className="methyl-orange">*</span>{" "}
            </div>
            <div id="add-images-frame">
              {range.map((index) => (
                <div key={index} className="images-preview" ref={this.ImageRef}>
                  <div className="trash-pricture">
                    <div>
                      <label style={{ float: "right" }} htmlFor={index}>
                        <PictureIcon />{" "}
                      </label>
                    </div>

                    <div
                      onClick={(ev) => {
                        this.deleteImageDom(ev);
                      }}
                    >
                      <Trash />
                    </div>
                  </div>
                  <input
                    onInput={(ev) => {
                      Preview(ev);
                    }}
                    id={index}
                    accept="image/*"
                    type="file"
                    className="images-file"
                    style={{ display: "none" }}
                    name={`image_${index}`}
                  ></input>
                </div>
              ))}
            </div>
          </div>
          <div>
            <hr style={{ visibility: "hidden" }}></hr>
            <div
              onClick={this.submit}
              className="button-37"
              style={{ width: "100%" }}
            >
              Publish
            </div>

            <div className="border-product-loc" style={{ minHeight: "250px" }}>
              <div className="header-product-loc classic-label">
                <div className="box-up-grid">
                  <div>
                    <input
                      placeholder="add tags"
                      name="setTag"
                      onInput={this.update}
                      value={this.state.setTag}
                      autoComplete="off"
                      className="classic-input"
                      style={{ width: "100%" }}
                    ></input>
                  </div>
                  <div>
                    <div
                      onClick={() => {
                        this.addItem();
                      }}
                      type="submit"
                      className="btn btn-outline-success"
                    >
                      add
                    </div>
                  </div>
                </div>
                <hr />
                {this.state.tags.map((i, _) => {
                  return (
                    <div className="tags-sel" key={_}>
                      <div
                        onClick={() => {
                          removeTags(_);
                        }}
                        style={{ color: "red" }}
                      >
                        <Remove />
                      </div>
                      <div>{i}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div
              ref={this.CategoryRef}
              className="border-product-loc"
              style={{ height: "250px" }}
            >
              <div className="header-product-loc classic-label">
                Categories <span className="methyl-orange">*</span> <hr />
                <CategoryHierarchy
                  onValueChange={(v) => {
                    console.log(v.id);
                    this.setState({ Category: v.id });
                  }}
                />
              </div>
            </div>
            <div className="border-product-loc" style={{ height: "60px" }}>
              <div className="header-product-loc classic-label">
                Options{" "}
                <span
                  onClick={() => {
                    this.state.OptionsExpand === true
                      ? this.setState({ OptionsExpand: false })
                      : this.setState({ OptionsExpand: true });
                  }}
                  className="backward-propagation"
                >
                  expand
                </span>
                <div
                  style={{
                    display:
                      this.state.OptionsExpand === true ? "block" : "none",
                  }}
                >
                  <OptionsDynamicForm
                    injectStructure={(props) => {
                      // HERE WE WANT TO STRUCTURE IT
                      // BASED ON HOW OUT DATABASE EXPECTS IT
                      this.setState({ Options: props }, () => {});
                    }}
                    unset={this.unsetExpandOptions}
                  />
                </div>
              </div>
            </div>
            <div className="dual-input">
              <div>
                <div className="label-product">
                  Price <span className="methyl-orange">*</span>{" "}
                </div>
                <input
                  className="product-input classic-input"
                  placeholder="price"
                  name="Price"
                  type="number"
                  onInput={this.update}
                  autoComplete="off"
                  required
                  ref={this.PriceRef}
                ></input>
              </div>
              <div>
                <div className="label-product">Discount</div>
                <input
                  className="product-input classic-input"
                  placeholder="Discount"
                  name="discount"
                  type="number"
                  onInput={this.update}
                ></input>
              </div>
            </div>
            <div className="triple-input">
              <div>
                <div className="label-product">
                  Length <span className="methyl-orange">*</span>{" "}
                </div>
                <input
                  className="product-input classic-input"
                  placeholder="Length"
                  name="Length"
                  type="number"
                  ref={this.LengthRef}
                  onInput={this.update}
                  required
                ></input>
              </div>
              <div>
                <div className="label-product">
                  Height <span className="methyl-orange">*</span>{" "}
                </div>
                <input
                  className="product-input classic-input"
                  placeholder="Height"
                  name="Height"
                  type="number"
                  ref={this.HeightRef}
                  onInput={this.update}
                  required
                ></input>
              </div>
              <div>
                <div className="label-product">
                  Breadth <span className="methyl-orange">*</span>{" "}
                </div>
                <input
                  className="product-input classic-input"
                  placeholder="Breadth"
                  name="Breadth"
                  type="number"
                  ref={this.BreadthRef}
                  onInput={this.update}
                  required
                ></input>
              </div>
            </div>
          </div>
        </div>
        <hr style={{ visibility: "hidden" }} />
        <div id="product-crud">
          <div className="roboto-condensed-light">Your Products</div>
          <hr />
          {this.state.product.length > 0
            ? this.state.product.map((i, j) => {
                return <div key={Math.random(0, 100)}>{i.page}</div>;
              })
            : null}
        </div>
      </div>
    );
  }
}

class OptionsDynamicForm extends Component {
  state = {
    Name: null,
    Image: null,
    Description: null,
    Price: 0,
    type: "AvalibleSize",
    previewRender: [],
  };
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.removePreview = this.removePreview.bind(this);
  }
  update(ev) {
    const { name, value, type } = ev.target;
    this.setState({ [name]: type === "file" ? ev.target.files[0] : value });
  }
  submitPreSet = (ev) => {
    ev.preventDefault();
    this.setState(
      (prevState) => ({
        // here if image is null then re-rest image because it might have previous one
        previewRender: [
          ...prevState.previewRender,
          {
            Name: this.state.Name,
            Image: this.state.Image,
            Description: this.state.Description,
            Price: this.state.Price,
            type: this.state.type,
          },
        ],
      }),
      () => {
        ev.target.reset();
        this.props.injectStructure(this.state.previewRender);
        // reset state here for further use
        this.setState({
          Name: null,
          Image: null,
          Description: null,
          Price: 0,
          type: "AvalibleSize",
        });
      }
    );
  };

  removePreview = (obj) => {
    const previewDummy = [...this.state.previewRender];
    const newPreviewRender = previewDummy.filter((x) => x !== obj);
    console.log(previewDummy, obj);
    this.setState({ previewRender: newPreviewRender }, () => {
      this.props.injectStructure(this.state.previewRender);
    });
  };

  // structure it in the form how backend accepts it when passing to local hoc
  render() {
    return (
      <>
        <dialog open id="dynamic-options-dialogue">
          <div
            onClick={() => {
              this.props.unset();
            }}
            className="label-product"
          >
            <div style={{ float: "right" }}>x</div>
          </div>
          <form onSubmit={this.submitPreSet}>
            <div className="label-product">
              Name <span className="methyl-orange">*</span>{" "}
            </div>
            <input
              className="product-input classic-input"
              placeholder="Name"
              name="Name"
              type="text"
              onInput={this.update}
              autoComplete="off"
              required
            ></input>
            <div className="label-product">Name</div>
            <input
              className="product-input classic-input"
              name="Image"
              onInput={this.update}
              type="file"
            ></input>
            <div className="label-product">Description</div>
            <textarea
              className="product-input classic-input"
              placeholder="Description"
              name="Description"
              type="text"
              autoComplete="off"
              onInput={this.update}
            ></textarea>
            <div className="label-product">Price</div>
            <input
              className="product-input classic-input"
              placeholder="Price"
              name="Price"
              type="number"
              autoComplete="off"
              onInput={this.update}
            ></input>
            <div className="label-product">
              Type (can add multiple type of options)
            </div>
            <select
              onInput={this.update}
              className="product-input classic-input"
              name="type"
            >
              <option value="AvalibleSize">AvalibleSize</option>
              <option value="Color">Color</option>
              <option value="Material">Material</option>
            </select>
            <hr style={{ visibility: "hidden" }} />
            <button
              type="submit"
              className="button-37"
              style={{ width: "100%" }}
            >
              Add
            </button>
          </form>
          <br />
          {this.state.previewRender.length > 0 ? (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Image</th>
                    <th scope="col">Description</th>
                    <th scope="col">Price</th>
                    <th scope="col">Type</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.previewRender.map((i, j) => {
                    const { Name, Image, Description, Price, type } = i;
                    return (
                      <tr key={j}>
                        <th scope="row">{j}</th>
                        <td>{Name}</td>
                        <td>
                          {Image !== null && Image !== "" ? (
                            <>
                              <img
                                height="50px"
                                width="50px"
                                src={URL.createObjectURL(Image)}
                              ></img>
                            </>
                          ) : null}
                        </td>
                        <td>{Description}</td>
                        <td>{Price}</td>
                        <td>{type}</td>
                        <td
                          onClick={() => {
                            this.removePreview(i);
                          }}
                          className="remove-preview-options"
                        >
                          <Remove />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          ) : null}
        </dialog>
      </>
    );
  }
}

export default Product;
