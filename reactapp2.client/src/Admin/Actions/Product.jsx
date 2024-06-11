import React, { Component } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Textarea from "@mui/joy/Textarea";
import Box from "@mui/material/Box";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { IoIosAdd } from "react-icons/io";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import "../../static/product.css";

class ProductForm extends Component {
  constructor(props) {
    super(props);
    this.addImage = this.addImage.bind(this);
    this.update = this.update.bind(this);
    this.send = this.send.bind(this);
    this.searchCategory = this.searchCategory.bind(this);
    this.addCategory = this.addCategory.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
    this.addSize = this.addSize.bind(this);
    this.deleteSize = this.deleteSize.bind(this);
  }
  state = {
    n: 1,
    image: [],
    category: null,
    addedCategory: [],
    AvalibleSize: [],
    gender: "female",
  };

  addImage() {
    this.setState({ n: this.state.n + 1 });
  }

  deleteImageDom(ev) {
    let node = ev.target;
    while (node && !node.classList.contains("image-struct")) {
      node = node.parentNode;
    }
    if (node && node.classList.contains("image-struct")) {
      node.remove();
    }
  }

  displayFile(ev) {
    const file = ev.target.files[0];
    const fakeURL = URL.createObjectURL(file);
    const tar = ev.target.parentNode.children[1];
    tar.style.backgroundImage = `url("${fakeURL}")`;
    tar.style.backgroundSize = "cover";
    tar.style.backgroundRepeat = "no-repeat";
    this.setState(
      (prevState) => ({
        image: [...prevState.image, ev.target.files[0]],
      }),
      () => {}
    );
  }

  update(ev) {
    const { name, value } = ev.target;
    if (name === "Category") {
      this.searchCategory(value);
    }
    this.setState({ [name]: value });
  }

  send(ev) {
    ev.preventDefault();
    // add only id of added category
    // check for atlease one image
    if (this.state.image.length === 0) {
      alert("Atlease on image required");
      return;
    }
    const addedCategory = [...this.state.addedCategory];
    const idFiltered = [];
    for (let i = 0; i <= addedCategory.length - 1; i++) {
      idFiltered[i] = addedCategory[i].id;
    }
    this.setState({ addedCategory: idFiltered }, () => {
      const formData = new FormData();
      console.log(this.state);
      Object.entries(this.state).forEach(([key, value]) => {
        if (
          Array.isArray(value) &&
          value.length > 0 &&
          value[0] instanceof File
        ) {
          value.forEach((file) => {
            formData.append(key, file);
          });
        } else {
          formData.append(key, value);
        }
      });
      fetch("staff/complex-form", {
        method: "PUT",
        body: formData,
      })
        .then((rsp) => rsp.json())
        .then((response) => {
          const { statusCode, value } = response;
          console.log(response);
          if (statusCode !== 200) {
            alert(value);
          } else {
            window.location.reload();
          }
        });
    });
  }

  searchCategory(query) {
    if (query !== "") {
      fetch(`/admin/searchCategory?query=${query}`, {
        method: "get",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((rsp) => rsp.json())
        .then((response) => {
          const { value } = response;
          const { result } = value;
          if (result != "") {
            this.setState({ category: result });
          }
        });
    }
  }

  addSize(ev) {
    ev.preventDefault();
    this.setState(
      (prevState) => ({
        AvalibleSize: [...prevState.AvalibleSize, this.state.size],
      }),
      () => {}
    );
  }
  addCategory(obj) {
    const copy = [...this.state.addedCategory];
    if (copy.find((x) => x.id === obj.id) === undefined) {
      this.setState(
        (prevState) => ({
          addedCategory: [...prevState.addedCategory, obj],
        }),
        () => {
          this.setState({ category: null });
        }
      );
    } else {
      alert("Already exists");
    }
  }

  deleteCategory(id) {
    let currArr = [...this.state.addedCategory];
    currArr = currArr.filter((x) => x.id != id);
    this.setState({ addedCategory: currArr });
  }

  deleteSize(id) {
    let currArr = [...this.state.size];
    this.setState({ size: currArr.filter((x) => x.id != id) });
  }

  render() {
    const { n } = this.state;
    return (
      <>
        <center>
          <div className="p-3 mb-2 bg-white text-dark" id="product-form">
            <form onSubmit={this.send} id="product-form-placer">
              <div>
                {Array.from({ length: n }).map((_, j) => (
                  <div key={j} className="image-struct">
                    <input
                      type="file"
                      id={`image_${j}`}
                      style={{ display: "none" }}
                      onInput={(ev) => {
                        this.displayFile(ev);
                      }}
                    ></input>
                    <Box
                      height="auto"
                      width="70%"
                      minHeight={250}
                      my={4}
                      key={j}
                      display="flex"
                      alignItems="center"
                      gap={4}
                      p={2}
                      sx={{ border: "1px dashed grey" }}
                    >
                      <div className="icons">
                        <div className="icons-actual">
                          <DeleteOutlineOutlinedIcon
                            onClick={(ev) => {
                              this.deleteImageDom(ev);
                            }}
                          />
                        </div>
                        <div className="icons-actual">
                          <label htmlFor={`image_${j}`}>
                            <PhotoCameraIcon />
                          </label>
                        </div>
                      </div>
                    </Box>
                  </div>
                ))}
                <div id="button-grid">
                  <div>
                    <Button
                      component="label"
                      style={{ width: "100%" }}
                      size="small"
                      role={undefined}
                      variant="outlined"
                      tabIndex={-1}
                      onClick={this.addImage}
                      startIcon={<CloudUploadIcon />}
                    >
                      more img
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <TextField
                  label="Name"
                  variant="outlined"
                  className="product-form-placer"
                  onInput={this.update}
                  name="name"
                  autoComplete="off"
                  required
                />
                <hr style={{ visibility: "hidden", height: "50px" }} />
                <TextField
                  label="Price"
                  className="product-form-placer"
                  onInput={this.update}
                  name="price"
                  autoComplete="off"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">Rs</InputAdornment>
                    ),
                  }}
                />
                <hr style={{ visibility: "hidden", height: "50px" }} />
                <TextField
                  label="Discount"
                  name="Discount"
                  autoComplete="off"
                  className="product-form-placer"
                  onInput={this.update}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">%</InputAdornment>
                    ),
                  }}
                />
                <hr style={{ visibility: "hidden", height: "50px" }} />
                <TextField
                  label="Brand"
                  name="Brand"
                  autoComplete="off"
                  className="product-form-placer"
                  onInput={this.update}
                />
                <hr style={{ visibility: "hidden", height: "50px" }} />
                <div id="add-category-grid">
                  <div>
                    <TextField
                      label="Add size"
                      variant="outlined"
                      name="size"
                      className="product-form-placer"
                      autoComplete="off"
                      onInput={this.update}
                    />
                  </div>
                  <div>
                    <Button
                      size="small"
                      style={{ float: "left", width: "90%" }}
                      variant="outlined"
                      id="add-category-button"
                      onClick={this.addSize}
                    >
                      add
                    </Button>
                  </div>
                </div>
                {this.state.AvalibleSize.length > 0 ? (
                  <>
                    {this.state.AvalibleSize.map((i, j) => {
                      return (
                        <div key={j}>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(5, 1fr)",
                              gap: "16px",
                              float: "left",
                              cursor: "pointer",
                            }}
                          >
                            <div>
                              <Box
                                sx={{
                                  bgcolor: "#f3e5f5",
                                  p: 2.5,
                                }}
                                onClick={() => {
                                  this.deleteSize(i.id);
                                }}
                              >
                                {i}
                              </Box>
                              <hr style={{ visibility: "hidden" }} />
                            </div>
                          </div>
                          <hr
                            style={{ visibility: "hidden", height: "50px" }}
                          />
                        </div>
                      );
                    })}
                  </>
                ) : null}
                <hr style={{ visibility: "hidden" }} />
                <TextField
                  label="Add category"
                  variant="outlined"
                  name="Category"
                  className="product-form-placer"
                  onInput={this.update}
                  autoComplete="off"
                />
                <hr style={{ visibility: "hidden", height: "50px" }} />
                {this.state.category != null ? (
                  <div id="searchCategory">
                    {this.state.category.map((i, j) => {
                      return (
                        <div key={i.id} className="search-options-page0des">
                          {i.productCategory}
                          <div style={{ float: "right", marginRight: "5px" }}>
                            <IoIosAdd
                              onClick={() => {
                                this.addCategory(i);
                              }}
                            />
                          </div>
                          <hr />
                        </div>
                      );
                    })}
                  </div>
                ) : null}
                {this.state.addedCategory.length > 0 ? (
                  <>
                    {this.state.addedCategory.map((i, j) => {
                      return (
                        <div key={i.productCategory}>
                          <hr
                            style={{ visibility: "hidden", height: "10px" }}
                          />
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(5, 1fr)",
                              gap: "16px",
                              float: "left",
                            }}
                            key={i.id}
                          >
                            <div>
                              <br />
                              <Box
                                onClick={() => {
                                  this.deleteCategory(i.id);
                                }}
                                sx={{
                                  bgcolor: "success.main",
                                  color: "success.contrastText",
                                  p: 2,
                                }}
                                style={{ userSelect: "none" }}
                              >
                                {i.productCategory}
                              </Box>
                            </div>
                            <hr
                              style={{ visibility: "hidden", height: "10px" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : null}
                <Textarea
                  color="neutral"
                  name="Description"
                  minRows={2}
                  placeholder="description..."
                  className="product-form-placer"
                  size="md"
                  variant="soft"
                  onInput={this.update}
                />
                <hr style={{ visibility: "hidden", height: "50px" }} />
                <select
                  onInput={this.update}
                  className="product-form-placer form-control"
                  aria-label="gender"
                  name="gender"
                >
                  <option defaultValue="female" value="female">
                    Female
                  </option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
                <hr style={{ visibility: "hidden", height: "50px" }} />
                <Button
                  size="small"
                  style={{ float: "left", width: "100%", marginTop: "20px" }}
                  variant="outlined"
                  color="success"
                  type="submit"
                >
                  submit form
                </Button>
              </div>
            </form>
          </div>
        </center>
      </>
    );
  }
}

class Product extends Component {
  state = {};
  render() {
    return (
      <>
        <ProductForm />
      </>
    );
  }
}

export default Product;
