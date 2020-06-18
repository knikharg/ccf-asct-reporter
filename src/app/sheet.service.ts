import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { parse } from 'papaparse';
import { ReportService } from './report.service';

export class TNode {
  id: any;
  name: String;
  parent: String;
  uberon_id: String;

  constructor(id, name, parent, u_id) {
    this.id = id;
    this.name = name;
    this.parent = parent;
    this.uberon_id = u_id;
  }
}

export class Tree {
  nodes: Array<Node>;
  id: any;

  constructor(id) {
    this.nodes = [];
    this.id = id;
  }

  public append(node) {
    this.nodes.push(node);
  }

  public search(name) {
    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].name == name) {
        return this.nodes[i];
      }
    }
    return {};
  }

}

export class Node {
  name: string;
  uberon: string;
  children?: Node[];

  constructor(name, children, uberon) {
    this.name = name;
    this.children = children;
    this.uberon = uberon;
  }

  public search(name) {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].name == name) {
        return this.children[i];
      }
    }
    return {};
  }
}

@Injectable({
  providedIn: 'root'
})
export class SheetService {

  anatomicalStructures = [];
  cellTypes = [];
  markers = [];

  constructor(private http: HttpClient, public report: ReportService) { }

  public getSheetData() {
    const sheetId = '1iUBrmiI_dB67_zCj3FBK9expLTmpBjwS';
    const gid = '567133323';
    return this.http.get(`https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`, { responseType: 'text' }).toPromise().then(data => {
      let parsedData = parse(data);
      return parsedData;
    });
  }

  public makeTreeData(data) {
    const cols = [0, 3, 6, 9, 12, 15];
    const id = 1;
    let parent;
    const tree = new Tree(id);

    const root = new TNode(id, 'body', 0, 0);
    delete root.parent; delete root.uberon_id;
    tree.append(root);

    data.forEach(row => {
      parent = root;
      for (let col = 0; col < cols.length; col++) {

        if (row[cols[col]] == '') {
          continue;
        }

        const searchedNode = tree.search(row[cols[col]]);

        if (Object.keys(searchedNode).length !== 0) {
          parent = searchedNode;
        } else {
          tree.id += 1;
          const newNode = new TNode(tree.id, row[cols[col]], parent.id, row[cols[col] + 2]);
          if (cols[col] != 15) {
            this.anatomicalStructures.push({
              structure: row[cols[col]],
              uberon: row[cols[col]+2]
            })

          } else {
            this.cellTypes.push({
              structure: row[cols[col]],
              link: row[cols[col]+2]
            })
          }

          tree.append(newNode);
          parent = newNode;
        }
      }
    });

    if (tree.nodes.length < 0) {
      return [];
    }
    return tree.nodes;
  }

  public makeIndentData(data) {
    const cols = [0, 3, 6, 9, 12, 15];
    const root = new Node('body', [], '');
    delete root.uberon;

    let parent;

    data.forEach(row => {
      parent = root;
      for (let col = 0; col < cols.length; col++) {
        if (row[cols[col]] == '') {
          continue;
        }

        const searchedNode = parent.search(row[cols[col]]);

        if (Object.keys(searchedNode).length !== 0) {
          parent = searchedNode;
        } else {
          const newNode = new Node(row[cols[col]], [], row[cols[col] + 2]);
          parent.children.push(newNode);
          parent = newNode;
        }
      }
    });

    return root;
  }
}
