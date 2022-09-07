/*
 * @Description:
 * @Author: yoki
 * @Date: 2022-07-26 14:49:28
 * @LastEditors: yoki
 * @LastEditTime: 2022-07-26 15:09:06
 * @FilePath: /nuxt-typescript-template/plugins/router.ts
 */
export default ({ app }: any) => {
  app.router.beforeEach((to: any, from: any, next: any) => {
    // to and from are both route objects. must call `next`.

    // 判断是否有权限能跳转过去
    //! 根据实际情况修改
    // if (checkHaveAuthNavigateToPath(app, to.path)) {
    //   next()
    // } else {
    //   const path = !from ? '/' : from.path

    //   // 由于next(path) nuxt里面会出现404的问题，所以上网搜了直接用app.router.replace()简单粗暴
    //   // https://blog.csdn.net/qq_41841298/article/details/87795810
    //   next()
    //   app.router.replace(path)
    // }

    next()

    // 从admin过来的
    // 先将参数存起来
  })

  app.router.afterEach((to: any, from: any) => {
    // to and from are both route objects.
  })
}
