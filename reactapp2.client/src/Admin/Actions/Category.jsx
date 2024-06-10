import React, { Component } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
// todo: authorization token once auth related thing is solved
export default class Category extends Component {
  constructor(props) {
    super(props);
    this.Search = this.Search.bind(this);
  }
  state = {
    parent: "",
    type: "",
    searchResult: null,
    parentSearch: false,
    initialCategory: null,
    editAction: null,
    editParentSearch: null,
  };

  loadInitial() {
    fetch("/admin/InitinalCategory", {
      method: "get",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        const { statusCode, value } = response;
        if (statusCode === 200) {
          this.setState({ initialCategory: value });
        }
      });
  }

  componentDidMount() {
    this.loadInitial();
  }

  update(ev) {
    const { name, value } = ev.target;
    this.setState({ [name]: value });
  }

  searchParent(query, condition) {
    fetch(`/admin/searchCategory?query=${query}`, {
      method: "get",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        const { value } = response;
        const { result } = value;
        if (result != "") {
          if (condition === "search") {
            this.setState({ initialCategory: result }, () => {});
            return;
          }
          this.setState({ searchResult: result }, () => {
            if (condition === "edit") {
              this.setState({ editParentSearch: true });
            } else {
              this.setState({ parentSearch: true });
            }
          });
        }
      });
  }

  getParent(ev, cd) {
    const { value } = ev.target;
    if (value === "") {
      this.setState({ parentSearch: false }, () => {});
    } else {
      this.searchParent(value, cd);
    }
  }

  create(ev) {
    ev.preventDefault();
    fetch("/admin/addCategory", {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state),
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        const { statusCode } = response;
        if (statusCode === 200) {
          ev.target.reset();
          this.loadInitial();
        } else {
          alert("Something went wrong");
        }
      });
  }

  deleteCategory(id) {
    fetch(`/admin/deleteCategory?id=${id}`, {
      method: "get",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        const { statusCode } = response;
        if (statusCode === 200) {
          this.loadInitial();
        }
      });
  }

  edit(id) {
    this.setState({ editAction: id, type: id.productCategory });
  }
  updateEdit(id) {
    fetch(`/admin/updateCategory?id=${id}`, {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state),
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        const { statusCode, value } = response;
        if (statusCode === 200) {
          this.setState({ editAction: null });
          this.loadInitial();
        } else {
          alert("Something went wrong");
        }
      });
  }
  Search(ev) {
    if (ev.keyCode === 13) {
      const { value } = ev.target;
        this.searchParent(value, "search");
    }
  }
  render() {
    const Helper = (props) => {
      return (
        <>
          <div id="parentSearchOptions" key="go away">
            {this.state.searchResult != null
              ? this.state.searchResult.map((i, j) => {
                  return (
                    <div key={i.id}>
                      <li className="options-list">
                        <span
                          onClick={() => {
                            document.querySelector(
                              props.args === "non-edit"
                                ? "#parent"
                                : "#edit-parent"
                            ).value = i.productCategory;
                            props.args === "non-edit"
                              ? this.setState({ parentSearch: false })
                              : this.setState({ editParentSearch: false });

                            this.setState({ parent: i.id });
                          }}
                          style={{ marginLeft: "5px" }}
                        >
                          {i.productCategory}
                        </span>
                      </li>
                      <hr />
                    </div>
                  );
                })
              : null}
          </div>
        </>
      );
    };
    return (
      <>
        <div id="CategoryGridItems">
          <div id="addCategory">
            <br />
            <center>
              <h5>Add Category tags</h5>
            </center>
            <br />
            <form
              action=""
              onSubmit={(ev) => {
                this.create(ev);
              }}
            >
              <input
                className="category-labels classical-input"
                placeholder="type"
                name="type"
                onInput={(ev) => {
                  this.update(ev);
                }}
                autoComplete="off"
              />
              <hr style={{visibility: "hidden"}} />
              <input
                placeholder="parent"
                className="category-labels classical-input"
                id="parent"
                autoComplete="off"
                onInput={(ev) => {
                  this.getParent(ev, "non-edit");
                }}
              />
              {this.state.parentSearch === true ? (
                <Helper args="non-edit" />
              ) : null}
              <button className="button category-labels" type="submit">
                Create
              </button>
            </form>
          </div>
          <div id="viewCategory">
            <center>
              <h5>Category Route</h5>
            </center>
            <br />
            <input
              placeholder="search"
              className="input-container category-labels classic-input"
              type="search"
              style={{ width: "625px" }}
              name="search"
              onKeyDown={this.Search}
              onInput={(ev) => {
                const {value} = ev.target;
                if (value === "") {
                  this.loadInitial();
                } 
              }}
              autoComplete="off"
            />
            <br />
            {this.state.initialCategory != null ? (
              <div key="table-cat-prop">
                <TableContainer sx={{ width: 625, m: 1 }} component={Paper}>
                  <Table
                    sx={{ width: 625 }}
                    key={"new"}
                    aria-label="simple table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Db (Id)</TableCell>
                        <TableCell align="right">Name</TableCell>
                        <TableCell align="right">Delete</TableCell>
                        <TableCell align="right">Edit</TableCell>
                      </TableRow>
                    </TableHead>
                    {this.state.initialCategory.map((i, j) => {
                      return (
                        <TableBody key={i.id}>
                          <TableRow
                            key={j * 2 + 1}
                            sx={{
                              "&:last-child td, &:last-child th": {
                                border: 0,
                              },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {i.id}
                            </TableCell>
                            <TableCell align="right">
                              {i.productCategory}
                            </TableCell>
                            <TableCell align="right">
                              <Button
                                variant="outlined"
                                startIcon={<DeleteIcon />}
                                color="error"
                                onClick={() => {
                                  this.deleteCategory(i.id);
                                }}
                              >
                                Del
                              </Button>
                            </TableCell>
                            <TableCell align="right">
                              <Button
                                onClick={() => {
                                  this.edit(i);
                                }}
                                variant="outlined"
                              >
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      );
                    })}
                  </Table>
                </TableContainer>
              </div>
            ) : null}
          </div>
          {this.state.editAction != null ? (
            <>
              <dialog className="edit-dialouge" open>
                <span style={{ fontWeight: "lighter" }}>Edit</span> <br />{" "}
                <hr style={{ visibility: "hidden" }} />
                <input
                  defaultValue={this.state.editAction.productCategory}
                  placeholder="type"
                  name="type"
                  onInput={(ev) => {
                    this.update(ev);
                  }}
                  className="classic-input"
                  style={{ width: "95%" }}
                ></input>
                <hr style={{ visibility: "hidden", height: "10px" }} />
                <input
                  onInput={(ev) => {
                    this.getParent(ev, "edit");
                  }}
                  defaultValue={this.state.editAction.parent === null ? "" : this.state.editAction.parent["productCategory"]}
                  placeholder="parent"
                  name="parent"
                  id="edit-parent"
                  className="classic-input"
                  style={{ width: "95%" }}
                ></input>
                {this.state.editParentSearch === true ? (
                  <Helper args="edit" />
                ) : null}
                <hr style={{ visibility: "hidden", height: "10px" }} />
                <button
                  onClick={() => {
                    this.updateEdit(this.state.editAction.id);
                  }}
                  className="classic-button"
                  style={{ width: "100%" }}
                >
                  Done!
                </button>
              </dialog>
            </>
          ) : null}
        </div>
      </>
    );
  }
}
