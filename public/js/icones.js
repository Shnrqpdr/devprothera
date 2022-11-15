export default () => {
  if (!/icones/gi.test(window.location.href)) return;

  $("#procurar").on("input", function () {
    const texto = $(this).val();
    const regex = new RegExp(texto, 'i');
    $(".file-name").each(function (index, elem) {
      const arquivo = $(elem).text();
      const match = regex.test(arquivo);
      if (match) {
        $(elem).closest('.icone').show()
      } else {
        $(elem).closest('.icone').hide()
      }
    });
  });

  $("svg").css({ fill: 'black' })
  $("path[fill], path[stroke]").each(function (index, elem) {
    const fill = $(elem).attr("fill");
    const stroke = $(elem).attr("stroke");
    const regex = /transparent|none/i;
    if (regex.test(fill) || regex.test(stroke)) return
    $(elem).parents("svg").css({ fill: 'none' })
  })
}