const http = require("http");
const path = require("path");
const fse = require("fs-extra");
const multiparty = require("multiparty");
const server = http.createServer();
const UPLOAD_DIR = path.resolve(__dirname, "..", "target"); // 大文件存储目录
const SAVE_DIR = path.resolve(__dirname, "..", "upload")

let getPostData = function (req) {
  return new Promise((resolve, reject) => {
    let params = '';
    req.on('data', (chunk) => {
      params += chunk;
    })
    req.on('end', (chunk) => {
      resolve(params)
    })
  })
}

let mergeFileChunk = async (filePath, filename) => {
  const chunkDir = `${UPLOAD_DIR}/${filename}`;
  // console.log(chunkDir)
  let chunkPaths = await fse.readdirSync(chunkDir);
  // console.log(chunkPaths)
  // let chunkPaths2 = await fse.readdirSync(chunkDir);
  // console.log(chunkPaths2)
  await fse.writeFile(filePath, "");
  console.log("到这里")
  chunkPaths.forEach(chunkPath => {
    fse.appendFileSync(filePath, fse.readFileSync(`${chunkDir}/${chunkPath}`));
    fse.unlinkSync(`${chunkDir}/${chunkPath}`)
  })
  console.log("合并成功")
  fse.rmdirSync(chunkDir); // 合并后删除保存切片的目录
}

server.on("request", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.status = 200;
    res.end();
    return;
  }

  if (req.url === '/merge') {
    let data = await getPostData(req);
    let {filename} = JSON.parse(data);
    const filePath = `${SAVE_DIR}/${filename}`;
    if (!fse.existsSync(SAVE_DIR)) {
      await fse.mkdirs(SAVE_DIR);
    }
    await mergeFileChunk(filePath, filename);
    res.end(
      JSON.stringify({
        code: 0,
        message: 'file merged success'
      })
    )
    return
  }

  let multipart = new multiparty.Form();
  multipart.parse(req, async (err, fields, files) => {
    if (err) {
      console.log(err)
      return;
    }
    let [chunk] = files.chunk;
    let [hash] = fields.hash;
    let [filename] = fields.filename;
    let chunkDir = `${UPLOAD_DIR}/${filename}`;

    // 切片目录不存在，创建切片目录
    if (!fse.existsSync(chunkDir)) {
      await fse.mkdirs(chunkDir);
    }


    await fse.move(chunk.path, `${chunkDir}/${hash}`);
    console.log(filename)
    res.end("received file chunk");
  });

});

server.listen(3005, () => console.log("正在监听 3005 端口"));