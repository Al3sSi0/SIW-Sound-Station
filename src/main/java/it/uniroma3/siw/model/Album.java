package it.uniroma3.siw.model;

import java.util.List;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
public class Album {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	@NotBlank
	private String nome;
	private int anno;
	@Size(max=255)
	private String imgUrl;
	@JsonIgnoreProperties({"albumIncisi", "braniIncisi", "braniOspite"})
	@ManyToOne
	private Artista autore;
	@JsonIgnoreProperties("album")
	@OneToMany(mappedBy="album" , cascade = CascadeType.REMOVE)
	private List<Brano> brani;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public int getAnno() {
		return anno;
	}
	public void setAnno(int anno) {
		this.anno = anno;
	}
	public String getImgUrl() {
		return imgUrl;
	}
	public void setImgUrl(String imgUrl) {
		this.imgUrl = imgUrl;
	}
	
	
	public Artista getAutore() {
		return autore;
	}
	public void setAutore(Artista autore) {
		this.autore = autore;
	}
	public List<Brano> getBrani() {
		return brani;
	}
	public void setBrani(List<Brano> brani) {
		this.brani = brani;
	}
	@Override
	public int hashCode() {
		return Objects.hash(anno, nome);
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Album other = (Album) obj;
		return Objects.equals(anno, other.anno) && Objects.equals(nome, other.nome);
	}
	
	
}
