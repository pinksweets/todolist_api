import * as express from 'express';
import * as logger from 'morgan';
import todo from './router/todo';

const app : express.Express = express();

app.use(logger('dev'));
app.use('/', todo);

// 404 error handler
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});

// 開発中のstacktrace出力
if (app.get('env') === 'development') {
    app.use((error : any, req, res, next) => {
        res.status(error['status'] || 500);
        res.render('error', {
            message: error.message,
            error
        });
    });
}

// stacktraceが無い場合のエラーハンドラ
app.use((error : any, req, res, next) => {
    res.status(error['status'] || 500);
    res.render('error', {
        message: error.message,
        error: {}
    });
    return null;
});

export default app;