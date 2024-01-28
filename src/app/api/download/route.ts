import { NextRequest, NextResponse } from 'next/server';
// import { redirect } from 'next/navigation'
import axios from 'axios';
import { Readable } from 'stream';

export async function GET(req: NextRequest) {
  const videoUrl = req.nextUrl.searchParams.get("url")
  // console.log('req', req.headers)
  if (!videoUrl) {
    // return redirect('/');
    return NextResponse.json({ status: 403 })
  }

  const decodedUrl = Buffer.from(videoUrl, 'base64').toString('utf-8');
  const filename = `ttvd-${Date.now()}.mp4`;

  const res = NextResponse.next()

  res.headers.append('Content-Type', 'application/octet-stream')
  res.headers.append('Content-Disposition', `attachment; filename="${filename}"`)
  // response.headers.append('Content-Length', size)
  
  const fetchData = await axios.get(decodedUrl, { responseType: 'stream' });
  const stream = new Readable();

  stream._read = () => {};

  fetchData.data.on('data', (chunk) => {
    // res.write(chunk);
    stream.push(chunk);
  });

  fetchData.data.on('end', () => {
    res.end();
  });

  fetchData.data.pipe(stream);


  return res






  // return NextResponse.json({ status: 200, videoUrl });


  // if (!req.query.url || req.query.url === '') {
  //   return res.redirect('/');
  // }

  // const { url, extension = 'mp4', size } = req.query;

  // const decodedUrl = Buffer.from(url, 'base64').toString('utf-8');
  // const filename = `your-app-name-${Date.now()}.${extension}`;

  // res.setHeader('Content-Type', 'application/octet-stream');
  // res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  // res.setHeader('Content-Length', size);

  // const response = await axios.get(decodedUrl, { responseType: 'stream' });

  // const stream = new Readable();
  // stream._read = () => {};
  // stream.on('data', (chunk) => {
  //   res.write(chunk);
  // });

  // response.data.on('end', () => {
  //   res.end();
  // });

  // response.data.pipe(stream);
}

// export { handler as GET, handler as POST }